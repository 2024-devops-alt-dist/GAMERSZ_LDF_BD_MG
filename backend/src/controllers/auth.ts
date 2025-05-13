/**
 * Authentication Controller
 *
 * This file contains controllers for authentication-related operations:
 * - register: Registers a new user with pending status
 * - login: Authenticates a user and issues a JWT token
 * - logout: Clears the authentication cookie
 *
 * Test with curl:
 *
 * Register:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "motivation": "I love gaming!"}' \
 *   http://localhost:3000/api/auth/register
 * ```
 *
 * Login:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"email": "test@example.com", "password": "password123"}' \
 *   -c cookies.txt \
 *   http://localhost:3000/api/auth/login
 * ```
 *
 * Logout:
 * ```
 * curl -X POST -b cookies.txt http://localhost:3000/api/auth/logout
 * ```
 */

import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserSchema } from '../models/User';

// Initialize User model
const User = mongoose.model('User', UserSchema);

// Get JWT configuration from environment variables or use defaults
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Register a new user
 *
 * Creates a new user with pending status. The user will need to be approved
 * by an administrator before they can fully participate.
 *
 * @param req Request object containing username, email, password, and motivation
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "motivation": "I love gaming!"}' \
 *   http://localhost:3000/api/auth/register
 * ```
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, motivation } = req.body;

    // Validate required fields
    if (!username || !email || !password || !motivation) {
      return res.status(400).json({
        message:
          'All fields are required: username, email, password, and motivation',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists',
      });
    }

    // Create new user with pending status
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by the pre-save hook in the User model
      motivation,
      status: 'pending', // All new users start with pending status
      role: 'player',
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully. Awaiting admin approval.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Login user
 *
 * Authenticates a user and issues a JWT token. Users with pending status
 * can log in but will receive a message explaining their limited access.
 *
 * @param req Request object containing email and password
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"email": "test@example.com", "password": "password123"}' \
 *   -c cookies.txt \
 *   http://localhost:3000/api/auth/login
 * ```
 *
 * The -c cookies.txt flag saves the cookie to a file for later use
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is banned or rejected
    if (user.status === 'banned' || user.status === 'rejected') {
      return res.status(403).json({
        message: 'Your account has been rejected or banned',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prepare payload for JWT
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status, // Include user status in the token
    };

    // Generate JWT token with type assertion
    // @ts-ignore - Ignoring type checking for jwt.sign
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none',
    });

    // Prepare response message based on user status
    let message = 'Login successful';
    if (user.status === 'pending') {
      message =
        'Login successful. Your account is pending approval. You can view chatrooms but cannot join them yet.';
    }

    res.status(200).json({
      message,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status, // Include status in the response
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Logout user
 *
 * Clears the authentication cookie to log the user out.
 *
 * @param req Request object
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -X POST -b cookies.txt http://localhost:3000/api/auth/logout
 * ```
 *
 * The -b cookies.txt flag uses the cookie saved from the login request
 */
export const logout = (req: Request, res: Response) => {
  try {
    // Clear the auth cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Error during logout',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get current authenticated user
 *
 * Retrieves the current authenticated user based on the JWT token in the cookie.
 *
 * @param req Request object
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -X GET -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/auth/me
 * ```
 *
 * The -H flag sets the cookie header
 */

export const currentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({
      message: 'Error during user validation',
    });
  }
};

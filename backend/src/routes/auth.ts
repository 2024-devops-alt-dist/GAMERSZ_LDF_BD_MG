/**
 * Authentication Routes
 *
 * This file defines the routes for authentication operations:
 * - POST /register: Register a new user
 * - POST /login: Authenticate a user and issue a JWT token
 * - POST /logout: Clear the authentication cookie
 * - POST /auth/me: Get the current authenticated user
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

import express, { Router, RequestHandler } from 'express';
import { login, register, logout, currentUser } from '../controllers/auth';

// Create a router instance
const router: Router = express.Router();

/**
 * Authentication Routes
 *
 * These routes do not require authentication as they are used to establish authentication.
 */

// Register a new user
router.post('/register', register as RequestHandler);

// Login a user
router.post('/login', login as RequestHandler);

// Logout a user
router.post('/logout', logout as RequestHandler);

// Get the current authenticated user
router.get('/me', currentUser as RequestHandler);

export default router;

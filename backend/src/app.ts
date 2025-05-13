/**
 * Express Application Setup
 *
 * This file configures the Express application, sets up middleware,
 * and registers routes. It exports the configured app without starting it.
 * The server.ts file will import this app and start the server.
 *
 * This separation of concerns allows for better testability and maintainability:
 * - app.ts handles Express configuration and route registration
 * - server.ts handles server startup, database connection, and graceful shutdown
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import chatroomRoutes from './routes/chatrooms';

// Load environment variables from .env file
dotenv.config();

/**
 * Initialize Express application
 * This creates a new Express application instance that will be configured
 * with middleware and routes before being exported.
 */
const app = express();

/**
 * Middleware Setup
 *
 * Middleware functions are executed in the order they are registered.
 * Each middleware has access to the request and response objects and can:
 * - Execute any code
 * - Modify the request and response objects
 * - End the request-response cycle
 * - Call the next middleware in the stack
 */

/**
 * CORS Middleware
 * Enables Cross-Origin Resource Sharing, allowing the API to be accessed
 * from different domains. This is essential for frontend applications
 * hosted on different domains to interact with the API.
 */
app.use(
  cors({
    // Allow requests from both localhost:5173 and null origin (file:// URLs)
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://gamersz-ldf-bd-mg-lucio-della-felices-projects.vercel.app/',
      ];
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/**
 * JSON Body Parser Middleware
 * Parses incoming request bodies with JSON payloads and makes the
 * resulting data available on req.body. This is necessary for
 * handling JSON data sent in POST/PUT requests.
 */
app.use(express.json());

/**
 * URL-encoded Body Parser Middleware
 * Parses incoming request bodies with URL-encoded payloads (form submissions)
 * and makes the resulting data available on req.body.
 * The 'extended: false' option uses the querystring library for parsing.
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Cookie Parser Middleware
 * Parses Cookie header and populates req.cookies with an object keyed by
 * cookie names. This is essential for handling JWT tokens stored in cookies.
 */
app.use(cookieParser());

/**
 * Route Registration
 *
 * Routes define the endpoints of the API and the handlers for each endpoint.
 * Each route is registered with a base path and a router that handles
 * requests to that path.
 */

/**
 * Authentication Routes
 * Handles user registration, login, and logout.
 * Base path: /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * Chatroom Routes
 * Handles chatroom listing, retrieval, and interaction.
 * Base path: /api/chatrooms
 * These routes are protected by authentication middleware.
 */
app.use('/api/chatrooms', chatroomRoutes);

// Note: Health check endpoint is defined in server.ts

/**
 * Export the configured Express application
 * This allows server.ts to import and use the app without
 * having to configure it again.
 */
export default app;

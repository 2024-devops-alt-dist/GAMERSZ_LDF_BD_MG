/**
 * ChatRoom Routes
 *
 * This file defines the routes for chatroom operations:
 * - GET /: Get all chatrooms
 * - GET /:id: Get a single chatroom by ID
 *
 * Future routes (commented out):
 * - POST /:id/join: Join a chatroom (requires approved status)
 * - POST /:id/leave: Leave a chatroom (requires approved status)
 * - POST /:id/messages: Send a message to a chatroom (requires approved status)
 *
 * Test with curl:
 *
 * Get all chatrooms:
 * ```
 * curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms
 * ```
 *
 * Get a single chatroom:
 * ```
 * curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms/CHATROOM_ID
 * ```
 *
 * Using cookies from login:
 * ```
 * curl -b cookies.txt http://localhost:3000/api/chatrooms
 * curl -b cookies.txt http://localhost:3000/api/chatrooms/CHATROOM_ID
 * ```
 */

import express, { Router, RequestHandler } from "express";
import {
	getAllChatRooms,
	getChatRoomById,
} from "../controllers/chatrooms";
import {
	authenticateUser,
	requireApprovedUser,
} from "../middlewares/authMiddleware";

// Create a router instance
const router: Router = express.Router();

/**
 * Authentication Middleware
 *
 * Apply basic authentication middleware to all chatroom routes.
 * This allows any registered user to view chatrooms, regardless of their status.
 */
router.use(authenticateUser as RequestHandler);

/**
 * Chatroom Routes for Viewing
 *
 * These routes are accessible to all authenticated users, including those with pending status.
 * They allow users to view chatrooms but not interact with them.
 */

// Get all chatrooms
router.get("/", getAllChatRooms as RequestHandler);

// Get a single chatroom by ID
router.get("/:id", getChatRoomById as RequestHandler);

/**
 * Future Routes for Chatroom Interaction
 *
 * These routes will require approved status to access.
 * They will be implemented in the future to allow users to join chatrooms and send messages.
 *
 * Example curl commands for future endpoints:
 * ```
 * # Join a chatroom (requires approved status)
 * curl -X POST -b cookies.txt http://localhost:3000/api/chatrooms/CHATROOM_ID/join
 *
 * # Leave a chatroom (requires approved status)
 * curl -X POST -b cookies.txt http://localhost:3000/api/chatrooms/CHATROOM_ID/leave
 *
 * # Send a message to a chatroom (requires approved status)
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"content": "Hello, world!"}' \
 *   -b cookies.txt \
 *   http://localhost:3000/api/chatrooms/CHATROOM_ID/messages
 * ```
 */

/*
// Join a chatroom (requires approved status)
router.post("/:id/join", requireApprovedUser as RequestHandler, joinChatRoom as RequestHandler);

// Leave a chatroom (requires approved status)
router.post("/:id/leave", requireApprovedUser as RequestHandler, leaveChatRoom as RequestHandler);

// Send a message to a chatroom (requires approved status)
router.post("/:id/messages", requireApprovedUser as RequestHandler, sendMessage as RequestHandler);
*/

export default router;

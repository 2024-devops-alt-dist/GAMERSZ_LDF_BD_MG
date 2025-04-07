/**
 * ChatRoom Routes
 *
 * This file defines the routes for chatroom operations:
 * - GET /: Get all chatrooms (public access)
 * - GET /:id: Get a single chatroom by ID (requires authentication)
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
 * curl http://localhost:3000/api/chatrooms
 * ```
 *
 * Get a single chatroom:
 * ```
 * curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms/CHATROOM_ID
 * ```
 *
 * Using cookies from login:
 * ```
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
 * Public Chatroom Routes
 *
 * The route for listing all chatrooms is publicly accessible without authentication.
 */

// Get all chatrooms (public access)
router.get("/", getAllChatRooms as RequestHandler);

/**
 * Protected Chatroom Routes
 *
 * These routes require authentication to access.
 */

// Get a single chatroom by ID (requires authentication)
router.get(
	"/:id",
	authenticateUser as RequestHandler,
	getChatRoomById as RequestHandler
);

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

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
import mongoose from "mongoose";
import { MessageSchema } from "../models/Message";
import { ChatRoomSchema } from "../models/ChatRoom";

// Initialize models with explicit collection names
const Message = mongoose.model("Message", MessageSchema, "messages");
const ChatRoom = mongoose.model(
	"ChatRoom",
	ChatRoomSchema,
	"chatrooms"
);

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

// Get messages for a chatroom
router.get(
	"/:id/messages",
	authenticateUser as RequestHandler,
	(async (req: express.Request, res: express.Response) => {
		try {
			const { id } = req.params;

			// Validate chatroom ID
			if (!mongoose.Types.ObjectId.isValid(id)) {
				return res
					.status(400)
					.json({ message: "Invalid chatroom ID format" });
			}

			// Get all messages and filter them manually
			const allMessages = await Message.find()
				.sort({ createdAt: 1 })
				.limit(100);

			// Filter messages manually
			const messages = allMessages.filter((msg) => {
				// Convert both to string for comparison
				const msgRoomId = msg.roomId ? msg.roomId.toString() : "";
				return msgRoomId === id;
			});

			// If still no results, try a more flexible approach
			if (messages.length === 0) {
				const flexibleMessages = allMessages.filter((msg) => {
					const msgRoomId = msg.roomId ? msg.roomId.toString() : "";
					return msgRoomId.includes(id) || id.includes(msgRoomId);
				});

				if (flexibleMessages.length > 0) {
					// Use these messages instead
					return res.status(200).json({
						message: "Messages retrieved successfully",
						data: flexibleMessages,
					});
				}
			}

			res.status(200).json({
				message: "Messages retrieved successfully",
				data: messages,
			});
		} catch (error) {
			console.error("Error fetching messages:", error);
			res.status(500).json({
				message: "Error fetching messages",
				error:
					error instanceof Error ? error.message : "Unknown error",
			});
		}
	}) as RequestHandler
);

// Send a message to a chatroom
router.post(
	"/:id/messages",
	requireApprovedUser as RequestHandler,
	(async (req: express.Request, res: express.Response) => {
		try {
			const { id } = req.params;
			const { content } = req.body;
			const userId = (req as any).user?._id;

			// Additional validation
			if (!userId) {
				return res
					.status(401)
					.json({ message: "User not authenticated" });
			}

			// Check if chatroom exists
			const chatroom = await ChatRoom.findById(id);
			if (!chatroom) {
				return res
					.status(404)
					.json({ message: "Chatroom not found" });
			}

			// Validate content length
			if (!content?.trim() || content.length > 1000) {
				return res.status(400).json({
					message:
						"Message content must be between 1 and 1000 characters",
				});
			}

			// Create and save message using the field names from the database (roomId and senderId)
			const newMessage = new Message({
				roomId: id, // Use roomId to match existing database schema
				senderId: userId, // Use senderId to match existing database schema
				content: content.trim(),
			});

			await newMessage.save();

			console.log("New message saved:", {
				id: newMessage._id,
				roomId: newMessage.roomId,
				senderId: newMessage.senderId,
				content: newMessage.content,
			});

			// #TODO socket.io set up, emit the new message
			// io.to(id).emit("new_message", newMessage);

			res.status(201).json({
				message: "Message sent successfully",
				data: newMessage,
			});
		} catch (error) {
			console.error("Error sending message:", error);
			res.status(500).json({
				message: "Error sending message",
				error:
					error instanceof Error ? error.message : "Unknown error",
			});
		}
	}) as RequestHandler
);

export default router;

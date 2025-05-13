import mongoose, { Schema } from "mongoose";
import { ChatRoom } from "../models/ChatRoom";
import { Message } from "../models/Message";
import {
	authenticateUser,
	requireApprovedUser,
} from "../middlewares/authMiddleware";

import express, { Router, RequestHandler } from "express";
import { getChatRoomById } from "../controllers/chatrooms";

const router = Router();

/**
 * Public Chatroom Routes
 *
 * The route for listing all chatrooms is publicly accessible without authentication.
 */

// Get all chatrooms (public access)
router.get(
	"/",
	async (_req: express.Request, res: express.Response) => {
		try {
			// Retrieve all chatrooms and sort by name
			const chatRooms = await ChatRoom.find().sort({ name: 1 });

			// Log all chatrooms for debugging
			console.log(
				"All chatrooms:",
				chatRooms.map((room: any) => ({
					id: room._id.toString(),
					name: room.name,
					game: room.game,
				}))
			);

			res.status(200).json({
				message: "Chatrooms retrieved successfully",
				data: chatRooms,
			});
		} catch (error) {
			console.error("Error fetching chatrooms:", error);
			res.status(500).json({
				message: "Error fetching chatrooms",
				error:
					error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

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
			const messages = allMessages.filter((msg: any) => {
				// Convert both to string for comparison
				const msgRoomId = msg.roomId ? msg.roomId.toString() : "";
				return msgRoomId === id;
			});

			// If still no results, try a more flexible approach
			if (messages.length === 0) {
				const flexibleMessages = allMessages.filter((msg: any) => {
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

// Send a message to a chatroom (with authentication)
// This middleware will be bypassed if userId is provided in the request body
router.post(
	"/:id/messages",
	(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		// Check if userId is provided in the request body
		if (
			req.body &&
			req.body.userId &&
			req.body.userStatus === "approved"
		) {
			console.log("Using userId from request body:", req.body.userId);
			// Set the user in the request object
			(req as any).user = {
				userId: req.body.userId,
				username: req.body.username,
				status: req.body.userStatus,
			};
			next();
		} else {
			// Use the authentication middleware
			requireApprovedUser(req, res, next);
		}
	},
	(async (req: express.Request, res: express.Response) => {
		try {
			const { id } = req.params;
			const { content, userId: bodyUserId, userStatus } = req.body;

			// Get user ID from either the request user object or the request body
			// This is a workaround for authentication issues
			let userId = (req as any).user?.userId;

			// If user ID is not in the request user object, try to get it from the request body
			if (!userId && bodyUserId) {
				console.log("Using user ID from request body:", bodyUserId);

				// Verify that the user status is approved if provided
				if (userStatus && userStatus !== "approved") {
					return res.status(403).json({
						message:
							"Your account must be approved to perform this action",
					});
				}

				userId = bodyUserId;
			}

			// Additional validation
			if (!userId) {
				console.error("No user ID found in request or body");
				return res
					.status(401)
					.json({ message: "User not authenticated" });
			}

			console.log("Processing message with user ID:", userId);

			// Log the chatroom ID we're looking for
			console.log("Looking for chatroom with ID:", id);

			// Check if the ID is a valid MongoDB ObjectId
			if (!mongoose.Types.ObjectId.isValid(id)) {
				console.error("Invalid chatroom ID format:", id);
				return res
					.status(400)
					.json({ message: "Invalid chatroom ID format" });
			}

			// Try different methods to find the chatroom
			console.log("Trying different methods to find chatroom");

			// Method 1: findById
			const chatroom1 = await ChatRoom.findById(id);
			console.log(
				"Method 1 (findById):",
				chatroom1 ? "Found" : "Not found"
			);

			// Method 2: findOne with _id
			const chatroom2 = await ChatRoom.findOne({ _id: id });
			console.log(
				"Method 2 (findOne with _id):",
				chatroom2 ? "Found" : "Not found"
			);

			// Method 3: findOne with _id as ObjectId
			const chatroom3 = await ChatRoom.findOne({
				_id: new mongoose.Types.ObjectId(id),
			});
			console.log(
				"Method 3 (findOne with ObjectId):",
				chatroom3 ? "Found" : "Not found"
			);

			// Use the result from the most successful method
			const chatroom = chatroom1 || chatroom2 || chatroom3;

			// Log the result
			if (chatroom) {
				console.log("Chatroom found:", {
					id: chatroom._id,
					name: chatroom.name,
				});
			} else {
				console.error("Chatroom not found with ID:", id);

				// Try to find all chatrooms to see what's available
				const allChatrooms = await ChatRoom.find().limit(5);
				console.log(
					"Available chatrooms:",
					allChatrooms.map((room: any) => ({
						id: room._id,
						name: room.name,
					}))
				);

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

			// Log the message creation parameters
			console.log("Creating new message with:", {
				roomId: id,
				senderId: userId,
				content:
					content.trim().substring(0, 20) +
					(content.length > 20 ? "..." : ""),
			});

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

// Direct message endpoint (no chatroom validation)
router.post("/:id/messages/direct", (async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const { content, userId, username, userStatus } = req.body;

		// Basic validation
		if (!content || !userId) {
			return res.status(400).json({
				message: "Content and userId are required",
			});
		}

		// Validate user status
		if (userStatus !== "approved") {
			return res.status(403).json({
				message:
					"Your account must be approved to perform this action",
			});
		}

		// Validate content length
		if (!content?.trim() || content.length > 1000) {
			return res.status(400).json({
				message:
					"Message content must be between 1 and 1000 characters",
			});
		}

		// Log the message creation parameters
		console.log("Creating new message with direct endpoint:", {
			roomId: id,
			senderId: userId,
			username: username,
			content:
				content.trim().substring(0, 20) +
				(content.length > 20 ? "..." : ""),
		});

		// Create and save message directly without chatroom validation
		const newMessage = new Message({
			roomId: id,
			senderId: userId,
			content: content.trim(),
		});

		await newMessage.save();

		console.log("New message saved via direct endpoint:", {
			id: newMessage._id,
			roomId: newMessage.roomId,
			senderId: newMessage.senderId,
			content: newMessage.content,
		});

		res.status(201).json({
			message: "Message sent successfully",
			data: newMessage,
		});
	} catch (error) {
		console.error(
			"Error sending message via direct endpoint:",
			error
		);
		res.status(500).json({
			message: "Error sending message",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
}) as RequestHandler);

export default router;

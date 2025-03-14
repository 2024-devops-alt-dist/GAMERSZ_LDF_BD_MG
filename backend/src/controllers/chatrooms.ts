/**
 * ChatRoom Controller
 *
 * This file contains controllers for chatroom-related operations:
 * - getAllChatRooms: Retrieves a list of all chatrooms
 * - getChatRoomById: Retrieves a single chatroom by ID
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
 * Alternative using Authorization header:
 * ```
 * curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms
 * ```
 */

import { Request, Response } from "express";
import mongoose from "mongoose";
import { ChatRoomSchema } from "../models/ChatRoom";

// Initialize ChatRoom model
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

/**
 * Get all chatrooms
 *
 * Retrieves a list of all chatrooms, sorted by name.
 * This endpoint is accessible to all authenticated users, including those with pending status.
 *
 * @param req Request object
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms
 * ```
 *
 * Or using the token from login (saved in cookies.txt):
 * ```
 * curl -b cookies.txt http://localhost:3000/api/chatrooms
 * ```
 */
export const getAllChatRooms = async (
	req: Request,
	res: Response
) => {
	try {
		// Retrieve all chatrooms and sort by name
		const chatRooms = await ChatRoom.find().sort({ name: 1 });

		res.status(200).json({
			message: "Chatrooms retrieved successfully",
			data: chatRooms,
		});
	} catch (error) {
		console.error("Error fetching chatrooms:", error);
		res.status(500).json({
			message: "Error fetching chatrooms",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get a single chatroom by ID
 *
 * Retrieves a single chatroom by its MongoDB ObjectId.
 * This endpoint is accessible to all authenticated users, including those with pending status.
 *
 * @param req Request object containing the chatroom ID in params
 * @param res Response object
 *
 * Test with curl:
 * ```
 * curl -H "Cookie: token=YOUR_JWT_TOKEN" http://localhost:3000/api/chatrooms/CHATROOM_ID
 * ```
 *
 * Or using the token from login (saved in cookies.txt):
 * ```
 * curl -b cookies.txt http://localhost:3000/api/chatrooms/CHATROOM_ID
 * ```
 *
 * Replace CHATROOM_ID with an actual MongoDB ObjectId from the database
 */
export const getChatRoomById = async (
	req: Request,
	res: Response
) => {
	try {
		const { id } = req.params;

		// Validate if the id is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res
				.status(400)
				.json({ message: "Invalid chatroom ID format" });
		}

		// Find the chatroom by ID
		const chatRoom = await ChatRoom.findById(id);

		// Check if the chatroom exists
		if (!chatRoom) {
			return res.status(404).json({ message: "Chatroom not found" });
		}

		res.status(200).json({
			message: "Chatroom retrieved successfully",
			data: chatRoom,
		});
	} catch (error) {
		console.error("Error fetching chatroom:", error);
		res.status(500).json({
			message: "Error fetching chatroom",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

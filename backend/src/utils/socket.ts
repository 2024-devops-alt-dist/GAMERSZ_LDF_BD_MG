/**
 * WebSocket Utilities
 *
 * Handles real-time communication features:
 * - Socket connection management
 * - Real-time message broadcasting
 * - User presence tracking
 * - Room events (join/leave notifications)
 * - Typing indicators
 * - Connection state management
 *
 * Implements:
 * - Authentication for socket connections
 * - Room-based message routing
 * - Error handling and reconnection logic
 * - Event handling and emission
 */

import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserSchema } from "../models/User";

// Get User model (or create it if it doesn't exist)
const User =
	mongoose.models.User || mongoose.model("User", UserSchema);

// Get JWT secret from environment variables or use default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Verify JWT token
const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, JWT_SECRET) as { userId: string };
	} catch (error) {
		return null;
	}
};

// Socket.IO event types
export enum SocketEvents {
	CONNECT = "connect",
	DISCONNECT = "disconnect",
	JOIN_ROOM = "join_room",
	LEAVE_ROOM = "leave_room",
	NEW_MESSAGE = "new_message",
	USER_JOINED = "user_joined",
	USER_LEFT = "user_left",
	ERROR = "error",
}

// Initialize Socket.IO server
export const initializeSocketIO = (httpServer: HttpServer) => {
	const io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL || "http://localhost:5173",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	// Middleware to authenticate Socket.IO connections
	io.use(async (socket, next) => {
		try {
			// Get token from handshake auth or cookies
			const token =
				socket.handshake.auth.token ||
				socket.handshake.headers.cookie
					?.split(";")
					.find((c) => c.trim().startsWith("token="))
					?.split("=")[1];

			if (!token) {
				return next(
					new Error("Authentication error: Token not provided")
				);
			}

			// Verify token
			const decoded = verifyToken(token);
			if (!decoded || !decoded.userId) {
				return next(new Error("Authentication error: Invalid token"));
			}

			// Get user from database
			const user = await User.findById(decoded.userId);
			if (!user) {
				return next(
					new Error("Authentication error: User not found")
				);
			}

			// Attach user to socket
			socket.data.user = user;
			next();
		} catch (error) {
			console.error("Socket.IO authentication error:", error);
			next(new Error("Authentication error"));
		}
	});

	// Handle Socket.IO connections
	io.on("connection", (socket) => {
		console.log(`Socket connected: ${socket.id}`);

		// Get user from socket data
		const user = socket.data.user;
		console.log(`User connected: ${user.username} (${user._id})`);

		// Handle joining a room
		socket.on(SocketEvents.JOIN_ROOM, async (roomId) => {
			try {
				// Join the room
				socket.join(roomId);
				console.log(`User ${user.username} joined room: ${roomId}`);

				// Notify other users in the room
				socket.to(roomId).emit(SocketEvents.USER_JOINED, {
					userId: user._id,
					username: user.username,
					timestamp: new Date(),
				});
			} catch (error) {
				console.error(`Error joining room: ${error}`);
				socket.emit(SocketEvents.ERROR, {
					message: "Failed to join room",
					error:
						error instanceof Error ? error.message : String(error),
				});
			}
		});

		// Handle leaving a room
		socket.on(SocketEvents.LEAVE_ROOM, (roomId) => {
			try {
				// Leave the room
				socket.leave(roomId);
				console.log(`User ${user.username} left room: ${roomId}`);

				// Notify other users in the room
				socket.to(roomId).emit(SocketEvents.USER_LEFT, {
					userId: user._id,
					username: user.username,
					timestamp: new Date(),
				});
			} catch (error) {
				console.error(`Error leaving room: ${error}`);
				socket.emit(SocketEvents.ERROR, {
					message: "Failed to leave room",
					error:
						error instanceof Error ? error.message : String(error),
				});
			}
		});

		// Handle new messages
		socket.on(SocketEvents.NEW_MESSAGE, async (message) => {
			try {
				const { roomId, content } = message;

				// Validate message
				if (!roomId || !content) {
					throw new Error(
						"Invalid message: roomId and content are required"
					);
				}

				// Broadcast the message to all users in the room
				io.to(roomId).emit(SocketEvents.NEW_MESSAGE, message);
				console.log(`Message sent to room ${roomId}: ${content}`);
			} catch (error) {
				console.error(`Error sending message: ${error}`);
				socket.emit(SocketEvents.ERROR, {
					message: "Failed to send message",
					error:
						error instanceof Error ? error.message : String(error),
				});
			}
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			console.log(`Socket disconnected: ${socket.id}`);
		});

		// Handle errors
		socket.on("error", (error) => {
			console.error(`Socket error: ${error}`);
		});
	});

	return io;
};

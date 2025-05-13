import React, { useEffect, useState, ReactNode } from "react";
import socketIO from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { Message } from "../types/Message";
import { SocketEvents } from "../types/SocketEvents";
import { SocketContext } from "./socket-context-type";
import { getAuthToken } from "../utils/auth";

// Socket.IO provider props
interface SocketProviderProps {
	children: ReactNode;
}

// Socket.IO provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({
	children,
}) => {
	const [socket, setSocket] = useState<ReturnType<
		typeof socketIO
	> | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuth();

	// Single useEffect to handle socket connection/disconnection
	useEffect(() => {
		// Skip effect if no user (not logged in)
		if (!user) {
			// If socket exists but no user, disconnect it (user logged out)
			if (socket) {
				// Only log in development
				if (import.meta.env.MODE !== "production") {
					console.log(
						"SocketProvider: User logged out, disconnecting socket"
					);
				}
				socket.disconnect();
				setSocket(null);
				setIsConnected(false);
			}
			return;
		}

		// Skip if socket already exists
		if (socket) {
			return;
		}

		// Only log in development
		if (import.meta.env.MODE !== "production") {
			console.log(
				"SocketProvider: Initializing socket for user",
				user.username
			);
		}

		// Get the auth token for socket connection
		const token = getAuthToken();

		// Create Socket.IO instance
		// Define the options with the withCredentials property and auth token
		const options = {
			autoConnect: true,
			withCredentials: true, // Enable sending cookies with cross-origin requests
			auth: token ? { token } : undefined, // Include token in auth if available
		};

		// Log socket connection options
		if (import.meta.env.MODE !== "production") {
			console.log("Socket connection options:", {
				url:
					import.meta.env.VITE_API_URL?.replace("/api", "") ||
					"http://localhost:3000",
				hasToken: !!token,
				withCredentials: true,
			});
		}

		// Create Socket.IO instance with the options
		const socketInstance = socketIO(
			import.meta.env.VITE_API_URL?.replace("/api", "") ||
				"http://localhost:3000",
			options
		);

		// Log the socket connection URL for debugging
		if (import.meta.env.MODE !== "production") {
			console.log(
				"Socket connection URL:",
				import.meta.env.VITE_API_URL?.replace("/api", "") ||
					"http://localhost:3000"
			);
		}

		// Set up event listeners
		socketInstance.on(SocketEvents.CONNECT, () => {
			if (import.meta.env.MODE !== "production") {
				console.log("Socket.IO connected");
			}
			setIsConnected(true);
			setError(null);
		});

		socketInstance.on(SocketEvents.DISCONNECT, () => {
			if (import.meta.env.MODE !== "production") {
				console.log("Socket.IO disconnected");
			}
			setIsConnected(false);
		});

		socketInstance.on(SocketEvents.ERROR, (error: Error) => {
			console.error("Socket.IO error:", error);
			setError(error.message || "Socket.IO error");
		});

		socketInstance.on("connect_error", (error: Error) => {
			console.error("Socket.IO connection error:", error);
			console.error("Socket.IO connection error details:", {
				message: error.message,
				stack: error.stack,
				name: error.name,
			});
			setError(`Connection error: ${error.message}`);

			// Try to reconnect after a delay
			setTimeout(() => {
				console.log("Attempting to reconnect socket...");
				socketInstance.connect();
			}, 5000);
		});

		// Save Socket.IO instance
		setSocket(socketInstance);

		// Clean up function
		return () => {
			if (import.meta.env.MODE !== "production") {
				console.log("SocketProvider: Cleaning up socket");
			}
			socketInstance.disconnect();
			// We don't set socket to null here to avoid re-renders
			// The socket will be cleaned up if the user logs out or the component unmounts
		};
	}, [user, socket]);

	// Join a room
	const joinRoom = (roomId: string) => {
		if (socket && isConnected) {
			socket.emit(SocketEvents.JOIN_ROOM, roomId);
			if (import.meta.env.MODE !== "production") {
				console.log(`Joining room: ${roomId}`);
			}
		} else {
			console.error("Cannot join room: Socket not connected");
			setError("Cannot join room: Socket not connected");
		}
	};

	// Leave a room
	const leaveRoom = (roomId: string) => {
		if (socket && isConnected) {
			socket.emit(SocketEvents.LEAVE_ROOM, roomId);
			if (import.meta.env.MODE !== "production") {
				console.log(`Leaving room: ${roomId}`);
			}
		}
	};

	// Send a message to a room
	const sendMessage = async (
		roomId: string,
		content: string
	): Promise<void> => {
		if (!socket || !isConnected) {
			throw new Error("Cannot send message: Socket not connected");
		}

		if (!user) {
			console.error("No user found in context");
			throw new Error("Cannot send message: User not authenticated");
		}

		// Log user information for debugging
		console.log("User information:", {
			_id: user._id,
			username: user.username,
			status: user.status,
			email: user.email,
		});

		if (user.status !== "approved") {
			console.error("User not approved:", user.status);
			throw new Error("Cannot send message: User not approved");
		}

		try {
			// First, save the message to the database via API
			// Use the full API URL instead of a relative path
			const apiUrl =
				import.meta.env.VITE_API_URL || "http://localhost:3000/api";

			// Get the auth token
			const token = getAuthToken();

			// Log detailed information about the request
			if (import.meta.env.MODE !== "production") {
				console.log("Sending message API request:", {
					url: `${apiUrl}/chatrooms/${roomId}/messages`,
					method: "POST",
					credentials: "include",
					hasToken: !!token,
					user: user,
					content: content.trim(),
				});

				// Check if document.cookie exists to verify cookie presence
				console.log("Current cookies:", document.cookie);
			}

			// Use the direct endpoint that doesn't require chatroom validation
			const response = await fetch(
				`${apiUrl}/chatrooms/${roomId}/messages/direct`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						content: content.trim(),
						// Include user ID directly in the request body
						userId: user._id,
						username: user.username,
						userStatus: user.status,
					}),
				}
			);

			// Log the API response for debugging
			if (import.meta.env.MODE !== "production") {
				console.log(
					`API request to: ${apiUrl}/chatrooms/${roomId}/messages/direct`,
					`Status: ${response.status}`
				);
			}

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Error response from message endpoint:", {
					status: response.status,
					text: errorText,
					userId: user._id,
					userStatus: user.status,
				});
				throw new Error(
					`Failed to send message: ${response.status} ${errorText}`
				);
			}

			const data = await response.json();
			const message: Message = data.data;

			// Then, emit the message via Socket.IO for real-time delivery
			socket.emit(SocketEvents.NEW_MESSAGE, message);
			if (import.meta.env.MODE !== "production") {
				console.log(`Sending message to room ${roomId}: ${content}`);
			}

			return Promise.resolve();
		} catch (error) {
			console.error("Error sending message:", error);
			setError(
				error instanceof Error
					? error.message
					: "Failed to send message"
			);
			return Promise.reject(error);
		}
	};

	// Provide Socket.IO context
	return (
		<SocketContext.Provider
			value={{
				socket,
				isConnected,
				joinRoom,
				leaveRoom,
				sendMessage,
				error,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

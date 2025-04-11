import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Chatroom } from "../types/Chatroom";
import { ENDPOINTS } from "../config/api";
import { useAuth } from "../hooks/useAuth";

export const ChatroomList: React.FC = () => {
	const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		// Fetch chatrooms from the API
		const fetchChatrooms = async () => {
			// Log authentication status
			console.log(
				"Authentication status:",
				isAuthenticated ? "Authenticated" : "Not authenticated"
			);
			try {
				console.log("Fetching chatrooms from:", ENDPOINTS.CHATROOMS);

				// Make sure we're sending the credentials with the request
				const response = await fetch(ENDPOINTS.CHATROOMS, {
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						// Add any other headers that might be needed
					},
				});

				console.log("Chatrooms response status:", response.status);

				if (!response.ok) {
					const errorText = await response.text();
					console.error("Chatrooms fetch error:", errorText);
					throw new Error(
						`Failed to fetch chatrooms: ${response.status} ${errorText}`
					);
				}

				const data = await response.json();
				console.log("Chatrooms data:", data);

				// Check if data.data exists and is an array
				if (data && data.data && Array.isArray(data.data)) {
					console.log(`Found ${data.data.length} chatrooms`);
					setChatrooms(data.data);
				} else {
					console.error("Unexpected data format:", data);
					setChatrooms([]);
				}
			} catch (error) {
				console.error("Error in fetchChatrooms:", error);
				setError(
					error instanceof Error ? error.message : "An error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchChatrooms();
	}, [isAuthenticated]);

	const handleChatroomClick = (chatroomId: string) => {
		console.log("Navigating to chatroom with ID:", chatroomId);
		navigate(`/chatrooms/${chatroomId}`);
	};

	if (isLoading) {
		return (
			<div className="text-center p-4">Loading chatrooms...</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-500 p-4">{error}</div>
		);
	}

	// If no chatrooms found, show a message
	if (chatrooms.length === 0) {
		return (
			<div className="text-center p-4">
				No chatrooms available. Please check back later.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{chatrooms.map((chatroom) => (
				<div
					key={chatroom._id}
					className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
					onClick={() => handleChatroomClick(chatroom._id)}
				>
					<h3 className="text-xl font-bold text-white mb-2">
						{chatroom.name}
					</h3>
					<p className="text-gray-300">Game: {chatroom.game}</p>
					<p className="text-xs text-gray-400 mt-2">
						ID: {chatroom._id}
					</p>
				</div>
			))}
		</div>
	);
};

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../config/api";
import type { Chatroom } from "../types/Chatroom";
import type { Message } from "../types/Message";
import { useAuth } from "../context/auth-context";
import { FaPaperPlane } from "react-icons/fa";

// Helper function to get the user ID from a message
const getUserIdFromMessage = (message: Message): string => {
	return message.senderId;
};

// API response types
interface ChatroomApiResponse {
	message: string;
	data: Chatroom;
}

interface MessagesApiResponse {
	message: string;
	data: Message[];
}

const ChatroomPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [chatroom, setChatroom] = useState<Chatroom | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user } = useAuth();

	// Scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Handle message input change
	const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.target.value);
	};

	// Handle message submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim() && id) {
			// TODO: Socket.IO will be implemented later
			// For now, just clear the input
			setNewMessage("");
			
			// Show a message that Socket.IO is not implemented yet
			alert("Socket.IO messaging will be implemented later. Your message: " + newMessage);
		}
	};

	// Fetch both chatroom and messages
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id) throw new Error("Chatroom ID is required");

				// Fetch chatroom details using the ENDPOINTS from config
				const chatroomUrl = ENDPOINTS.CHATROOM(id);
				
				const chatroomResponse = await fetch(chatroomUrl, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!chatroomResponse.ok) {
					const errorText = await chatroomResponse.text();
					console.error("Chatroom fetch error:", errorText);
					
					// If we get a 404, try to fetch the chatroom list and find the matching chatroom
					if (chatroomResponse.status === 404) {
						console.log("Chatroom not found, trying to fetch from chatroom list");
						const chatroomsResponse = await fetch(ENDPOINTS.CHATROOMS, {
							credentials: "include",
							headers: {
								"Content-Type": "application/json"
							}
						});
						
						if (chatroomsResponse.ok) {
							const chatroomsData = await chatroomsResponse.json();
							
							// Find a chatroom with a matching ID or similar ID
							const matchingChatroom = chatroomsData.data.find((room: Chatroom) => 
								room._id === id || room._id.includes(id) || id.includes(room._id)
							);
							
							if (matchingChatroom) {
								console.log("Found matching chatroom:", matchingChatroom);
								setChatroom(matchingChatroom);
								
								// Now fetch messages for this chatroom
								await fetchMessages(matchingChatroom._id);
								return; // Skip the error
							}
						}
					}
					
					throw new Error(`Failed to fetch chatroom: ${chatroomResponse.status} ${errorText}`);
				}

				const chatroomData: ChatroomApiResponse =
					await chatroomResponse.json();
				setChatroom(chatroomData.data);

				// Fetch messages for this chatroom
				await fetchMessages(id);
			} catch (error) {
				console.error("Error in fetchData:", error);
				setError(
					error instanceof Error ? error.message : "An error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchMessages = async (chatroomId: string) => {
			try {
				const messagesUrl = ENDPOINTS.MESSAGES(chatroomId);
				
				const messagesResponse = await fetch(messagesUrl, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				});
				
				if (!messagesResponse.ok) {
					const errorText = await messagesResponse.text();
					throw new Error(`Failed to fetch messages: ${messagesResponse.status} ${errorText}`);
				}

				const messagesData: MessagesApiResponse =
					await messagesResponse.json();
				
				setMessages(messagesData.data);
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		fetchData();
	}, [id]);

	// Scroll to bottom when messages are loaded
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-900">
				<div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{error}</span>
				</div>
			</div>
		);
	}

	if (!chatroom) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-900">
				<div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">Not Found: </strong>
					<span className="block sm:inline">
						The chatroom you're looking for doesn't exist.
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-900 text-white">
			{/* Chatroom Header */}
			<div className="bg-gray-800 shadow p-4 flex items-center">
				<h1 className="text-xl font-bold text-white">{chatroom.name}</h1>
				<span className="ml-2 text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
					{chatroom.game}
				</span>
			</div>

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center text-gray-400 my-8">
						No messages yet. Be the first to say hello!
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message._id}
							className={`flex ${
								getUserIdFromMessage(message) === user?._id
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
									getUserIdFromMessage(message) === user?._id
										? "bg-primary text-white"
										: "bg-gray-800 border border-gray-700 text-gray-100"
								}`}
							>
								<div className="font-bold text-sm">
									{getUserIdFromMessage(message) === user?._id
										? "You"
										: "User"}
								</div>
								<div className="mt-1">{message.content}</div>
								<div className="text-xs opacity-75 text-right mt-1">
									{new Date(
										message.createdAt
									).toLocaleTimeString()}
								</div>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input */}
			<div className="bg-gray-800 p-4 shadow-inner border-t border-gray-700">
				<form
					onSubmit={handleSubmit}
					className="flex items-center space-x-2"
				>
					<input
						type="text"
						value={newMessage}
						onChange={handleMessageChange}
						placeholder="Type a message..."
						className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
					/>
					<button
						type="submit"
						disabled={!newMessage.trim()}
						className="bg-primary text-white rounded-full p-2 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<FaPaperPlane className="h-5 w-5" />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatroomPage;

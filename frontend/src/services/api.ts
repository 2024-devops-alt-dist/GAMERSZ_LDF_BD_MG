import { ENDPOINTS } from "../config/api";
import type { Message, MessagesApiResponse } from "../types/Message";
import type { Chatroom } from "../types/Chatroom";

export const messageService = {
	// Fetch chatroom details
	async fetchChatroom(chatroomId: string): Promise<Chatroom> {
		const response = await fetch(ENDPOINTS.CHATROOM(chatroomId), {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch chatroom");
		}

		const data = await response.json();
		return data.data;
	},

	// Fetch messages for a chatroom
	async fetchMessages(chatroomId: string): Promise<Message[]> {
		const response = await fetch(ENDPOINTS.MESSAGES(chatroomId), {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch messages");
		}

		const data: MessagesApiResponse = await response.json();
		return data.data;
	},

	// Send a new message
	async sendMessage(
		chatroomId: string,
		content: string
	): Promise<Message> {
		const response = await fetch(ENDPOINTS.MESSAGES(chatroomId), {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content }),
		});

		if (!response.ok) {
			throw new Error("Failed to send message");
		}

		const data = await response.json();
		return data.data;
	},
};

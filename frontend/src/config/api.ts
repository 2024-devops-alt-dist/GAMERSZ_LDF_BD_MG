// API configuration
export const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API endpoints
export const ENDPOINTS = {
	CHATROOMS: `${API_BASE_URL}/chatrooms`,
	MESSAGES: (chatroomId: string) =>
		`${API_BASE_URL}/chatrooms/${chatroomId}/messages`,
	CHATROOM: (chatroomId: string) =>
		`${API_BASE_URL}/chatrooms/${chatroomId}`,
};

export interface Message {
	_id: string;
	roomId: string; // Field name used in MongoDB
	senderId: string; // Field name used in MongoDB
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface MessagesApiResponse {
	message: string;
	data: Message[];
}

export interface Chatroom {
	_id: string;
	name: string;
	game: string;
	createdAt: string;
}

export interface ChatroomApiResponse {
	message: string;
	data: Chatroom;
}

export interface ChatroomsApiResponse {
	message: string;
	data: Chatroom[];
}

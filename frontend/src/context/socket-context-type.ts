import { createContext } from "react";
import socketIO from "socket.io-client";

// Socket.IO context type
export interface SocketContextType {
	socket: ReturnType<typeof socketIO> | null;
	isConnected: boolean;
	joinRoom: (roomId: string) => void;
	leaveRoom: (roomId: string) => void;
	sendMessage: (roomId: string, content: string) => Promise<void>;
	error: string | null;
}

// Create Socket.IO context
export const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
	joinRoom: () => {},
	leaveRoom: () => {},
	sendMessage: async () => {},
	error: null,
});

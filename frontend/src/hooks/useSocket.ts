import { useContext } from "react";
import {
	SocketContext,
	SocketContextType,
} from "../context/socket-context-type";

// Custom hook to use Socket.IO context
export const useSocket = (): SocketContextType => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

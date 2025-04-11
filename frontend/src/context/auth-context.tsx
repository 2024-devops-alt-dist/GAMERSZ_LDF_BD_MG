import { createContext } from "react";

export interface User {
	email: string;
	username: string;
	role: string;
	status: string;
	photoUrl: string;
}
interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (user: User) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

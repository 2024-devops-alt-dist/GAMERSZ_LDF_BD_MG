import { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "../context/auth-context";
import {
	getAuthToken,
	setAuthToken,
	clearAuthToken,
} from "../utils/auth";

interface AuthProviderProps {
	children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const login = (user: User) => {
		console.log("AuthProvider: Setting user", user);

		// Extract token from cookies and store in localStorage
		const tokenCookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith("token="));

		if (tokenCookie) {
			const token = tokenCookie.split("=")[1];
			// Store token in localStorage for future use
			setAuthToken(token);
			console.log("AuthProvider: Token stored during login");
		} else {
			console.warn(
				"AuthProvider: No token found in cookies during login"
			);
		}

		setUser(user);
		setIsAuthenticated(true);
		console.log("AuthProvider: Authentication state updated");
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const apiUrl =
					import.meta.env.VITE_API_URL || "http://localhost:3000/api";
				console.log("AuthProvider: Using API URL:", apiUrl);

				// Get the auth token
				const token = getAuthToken();
				console.log("AuthProvider: Token available:", !!token);

				const response = await fetch(`${apiUrl}/auth/me`, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						// Add Authorization header if token exists
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				});

				if (!response.ok) throw new Error("Not authenticated");
				const data = await response.json();
				console.log("AuthProvider: Fetched user data:", data);

				if (!data.user) {
					throw new Error("Invalid user data received from server");
				}

				// Convert backend user format to our User type
				const userData: User = {
					_id: data.user._id || data.user.id || "", // Handle both _id and id
					email: data.user.email || "",
					username: data.user.username || "",
					role: data.user.role || "player",
					status: data.user.status || "pending",
					photoUrl:
						data.user.photoUrl || "https://via.placeholder.com/150",
				};

				console.log("AuthProvider: Processed user data:", userData);

				// Extract token from cookies and store in localStorage
				const tokenCookie = document.cookie
					.split("; ")
					.find((row) => row.startsWith("token="));

				if (tokenCookie) {
					const token = tokenCookie.split("=")[1];
					// Store token in localStorage
					setAuthToken(token);
					console.log("AuthProvider: Token stored from cookies");
				} else {
					console.warn("AuthProvider: No token found in cookies");
				}

				setUser(userData);
				setIsAuthenticated(true);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const logout = async () => {
		console.log("AuthProvider: Logging out");
		try {
			const apiUrl =
				import.meta.env.VITE_API_URL || "http://localhost:3000/api";
			console.log("AuthProvider: Using API URL for logout:", apiUrl);

			const response = await fetch(`${apiUrl}/auth/logout`, {
				method: "POST",
				credentials: "include",
				headers: {
					// Add Authorization header as a fallback if token exists in localStorage
					...(localStorage.getItem("token")
						? {
								Authorization: `Bearer ${localStorage.getItem(
									"token"
								)}`,
						  }
						: {}),
				},
			});

			if (response.ok) {
				console.log("AuthProvider: Logout successful");
			} else {
				console.error(
					"AuthProvider: Logout failed",
					await response.text()
				);
			}
		} catch (error) {
			console.error("AuthProvider: Logout error", error);
		}

		// Clear token from localStorage
		clearAuthToken();
		console.log("AuthProvider: Token removed");

		// Update state
		setUser(null);
		setIsAuthenticated(false);

		// Redirect to login page
		window.location.replace("/login");
	};
	if (loading) return <div>Loading...</div>;
	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLoginClick = () => {
		// Use React Router's navigate for client-side navigation
		navigate("/login");
	};

	const handleRegisterClick = () => {
		// Use React Router's navigate for client-side navigation
		navigate("/register");
	};

	return (
		<header className="bg-gray-800 text-white py-4 shadow-md">
			<div className="container mx-auto flex items-center justify-between px-4">
				<h1 className="text-2xl font-bold">
					<Link
						to="/"
						className="hover:text-primary"
					>
						Gamerz
					</Link>
				</h1>

				<nav>
					<ul className="flex items-center space-x-6">
						<li>
							<Link
								to="/"
								className="hover:underline"
							>
								ChatList
							</Link>
						</li>
						<li>
							<Link
								to="/about"
								className="hover:underline"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								to="/contact"
								className="hover:underline"
							>
								Contact
							</Link>
						</li>

						{user ? (
							<div className="flex items-center space-x-4 bg-gray-700 px-4 py-2 rounded-md shadow-md">
								<img
									src={user.photoUrl}
									alt="User Avatar"
									className="w-10 h-10 rounded-full border-2 border-white"
								/>
								<div className="text-sm text-left">
									<p className="font-semibold">{user.username}</p>
									<p className="text-gray-300 text-xs">
										{user.status || "Online"}
									</p>
								</div>
								<button
									onClick={logout}
									className="ml-2 btn btn-sm btn-outline text-white hover:bg-red-600"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="space-x-3">
								<button
									onClick={handleLoginClick}
									className="btn btn-sm btn-outline text-white"
								>
									Login
								</button>
								<button
									onClick={handleRegisterClick}
									className="btn btn-sm btn-outline text-white"
								>
									Register
								</button>
							</div>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
};

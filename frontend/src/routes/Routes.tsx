import { Route, Routes } from "react-router-dom";

import LoginPage from "../pages/Login";
import Homepage from "../pages/Homepage";
import ChatroomPage from "../pages/ChatroomPage";
import React from "react";

const Router: React.FC = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<Homepage />}
			/>
			<Route
				path="/login"
				element={<LoginPage />}
			/>
			<Route
				path="/chatrooms/:id"
				element={<ChatroomPage />}
			/>
			{/* Add a redirect from the old path to maintain compatibility */}
			<Route
				path="/chatroom/:id"
				element={<ChatroomPage />}
			/>
		</Routes>
	);
};

export default Router;

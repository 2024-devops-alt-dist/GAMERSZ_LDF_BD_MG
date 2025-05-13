/**
 * Authentication Middleware
 *
 * This file contains middleware functions for handling authentication and authorization:
 * - authenticateUser: Verifies the JWT token and attaches the user to the request
 * - requireApprovedUser: Ensures the user has approved status
 * - authorizeRole: Ensures the user has the required role
 */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
	user?: any;
}

// Get JWT secret from environment variables or use default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Basic authentication middleware
 * Verifies the JWT token and attaches the user to the request
 * This allows any registered user to access the route, regardless of status
 */
export const authenticateUser = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	// Get token from cookies or Authorization header
	let token = req.cookies.token;

	// If no token in cookies, check Authorization header
	if (!token) {
		const authHeader = req.header("Authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) {
			token = authHeader.replace("Bearer ", "");
			console.log("Using token from Authorization header");
		}
	} else {
		console.log("Using token from cookies");
	}

	// Check if token exists
	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		// Verify token and attach user to request
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		console.log("User authenticated:", {
			userId: (decoded as any).userId,
			username: (decoded as any).username,
			status: (decoded as any).status,
		});
		next();
	} catch (error) {
		console.error("Token verification failed:", error);
		return res.status(401).json({ message: "Invalid token" });
	}
};

/**
 * Middleware to ensure user has approved status
 * This is used for actions that require approval, such as joining chatrooms
 */
export const requireApprovedUser = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	// First ensure the user is authenticated
	if (!req.user) {
		console.error("requireApprovedUser: No user found in request");
		return res
			.status(401)
			.json({ message: "Authentication required" });
	}

	console.log("requireApprovedUser: Checking user status", {
		userId: req.user.userId,
		username: req.user.username,
		status: req.user.status,
	});

	// Then check if the user is approved
	if (req.user.status !== "approved") {
		console.error("requireApprovedUser: User not approved", {
			userId: req.user.userId,
			status: req.user.status,
		});
		return res.status(403).json({
			message: "Your account must be approved to perform this action",
		});
	}

	console.log("requireApprovedUser: User approved, proceeding");
	next();
};

/**
 * Role-based authorization middleware
 * @param allowedRoles Array of roles that are allowed to access the route
 * @returns Middleware function that checks if the user has one of the allowed roles
 */
export const authorizeRole =
	(allowedRoles: string[]) =>
	(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		next();
	};

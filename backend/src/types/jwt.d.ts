/**
 * JWT Type Definitions
 *
 * This file extends the jsonwebtoken module to include our custom payload structure.
 * It ensures proper typing for the JWT payload throughout the application.
 */

import * as jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
	/**
	 * Extended JWT Payload
	 *
	 * This interface extends the default JWT payload to include our custom fields:
	 * - userId: MongoDB ObjectId of the user
	 * - username: User's username
	 * - email: User's email address
	 * - role: User's role (player, admin)
	 * - status: User's status (pending, approved, rejected, banned)
	 */
	export interface JwtPayload {
		userId: string;
		username: string;
		email: string;
		role: string;
		status: string;
	}
}

/**
 * Server Entry Point
 *
 * This file is the main entry point for the application.
 * It imports the Express app from app.ts, connects to MongoDB,
 * and starts the server with proper error handling and graceful shutdown.
 *
 * Responsibilities:
 * - Load environment variables
 * - Connect to the database
 * - Start the HTTP server
 * - Handle graceful shutdown
 * - Define health check endpoint with database status
 *
 * Testing the API with curl:
 *
 * Health check:
 * ```
 * curl http://localhost:3000/health
 * ```
 *
 * Register a new user:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "motivation": "I love gaming!"}' \
 *   http://localhost:3000/api/auth/register
 * ```
 *
 * Login:
 * ```
 * curl -X POST -H "Content-Type: application/json" \
 *   -d '{"email": "test@example.com", "password": "password123"}' \
 *   -c cookies.txt \
 *   http://localhost:3000/api/auth/login
 * ```
 *
 * Get all chatrooms (using saved cookie):
 * ```
 * curl -b cookies.txt http://localhost:3000/api/chatrooms
 * ```
 *
 * Logout:
 * ```
 * curl -X POST -b cookies.txt http://localhost:3000/api/auth/logout
 * ```
 */

import dotenv from "dotenv";
import { connectToDatabase, client } from "./config/database";
import app from "./app";

/**
 * Load environment variables from .env file
 * This makes environment variables defined in the .env file
 * available in process.env
 */
dotenv.config();

/**
 * Environment Variable Validation
 *
 * Check that required environment variables are defined.
 * This helps catch configuration errors early and provides
 * clear feedback about what's missing.
 */
const envCheck = {
	"Server Port": process.env.PORT || "3000 (default)",
	"MongoDB Username": process.env.MONGODB_USERNAME ? "✓" : "✗",
	"MongoDB Password": process.env.MONGODB_PASSWORD ? "✓" : "✗",
	"JWT Secret": process.env.JWT_SECRET ? "✓" : "✗",
};

/**
 * Display environment check results in the console
 * This provides immediate feedback about the configuration
 * when the server starts.
 */
console.log("\nEnvironment Check:");
console.log("─".repeat(30));
Object.entries(envCheck).forEach(([key, value]) => {
	console.log(`${key}: ${value}`);
});
console.log("─".repeat(30), "\n");

/**
 * Set the port for the server to listen on
 * Uses the PORT environment variable if defined, otherwise defaults to 3000
 */
const PORT = process.env.PORT || 3000;

/**
 * Health Check Endpoint
 *
 * This endpoint provides information about the server and database status.
 * It's useful for monitoring and deployment health checks.
 *
 * The endpoint overrides the one defined in app.ts to include database status.
 *
 * @route GET /health
 * @returns {Object} Status information including:
 *   - status: "ok" or "error"
 *   - timestamp: Current time in ISO format
 *   - database: "connected", "disconnected", or "error"
 *   - message: Error message (only if status is "error")
 */
app.get("/health", async (req, res) => {
	try {
		// Check MongoDB connection status with a ping
		const dbStatus = await client
			.db()
			.admin()
			.ping()
			.then(() => "connected")
			.catch(() => "disconnected");

		// Return success response with database status
		res.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			database: dbStatus,
		});
	} catch (error) {
		// Return error response if something goes wrong
		res.status(503).json({
			status: "error",
			timestamp: new Date().toISOString(),
			database: "error",
			message:
				error instanceof Error
					? error.message
					: "Unknown database error",
		});
	}
});

/**
 * Server Startup Function
 *
 * This asynchronous function handles the server startup process:
 * 1. Connect to MongoDB
 * 2. Start the HTTP server
 * 3. Set up graceful shutdown handlers
 *
 * @returns {http.Server} The HTTP server instance
 * @throws {Error} If the server fails to start
 */
async function startServer() {
	console.log("Starting application...");

	try {
		/**
		 * Connect to MongoDB
		 * This establishes the connection to the database
		 * using the configuration from config/database.ts
		 */
		await connectToDatabase();

		/**
		 * Start the HTTP server
		 * This starts listening for incoming HTTP requests on the specified port
		 */
		const server = app.listen(PORT, () => {
			console.log(`🚀 Server is running at http://localhost:${PORT}`);
			console.log(`  - curl http://localhost:${PORT}/health`);
			console.log(`  - API endpoints available at:`);
			console.log(`    - /api/auth/register`);
			console.log(`    - /api/auth/login`);
			console.log(`    - /api/auth/logout`);
			console.log(`    - /api/chatrooms`);
			console.log(`    - /api/chatrooms/:id`);
		});

		/**
		 * Graceful Shutdown Handlers
		 *
		 * These handlers ensure that the server and database connections
		 * are closed properly when the process is terminated.
		 *
		 * SIGINT: Sent when the user presses Ctrl+C in the terminal
		 * SIGTERM: Sent when the process is terminated (e.g., by a process manager)
		 */

		/**
		 * SIGINT Handler
		 * Handles graceful shutdown when the user presses Ctrl+C
		 */
		process.on("SIGINT", async () => {
			console.log("\nReceived SIGINT signal...");
			try {
				// Close the HTTP server first to stop accepting new connections
				server.close(() => {
					console.log("✓ HTTP server closed");
				});

				// Then close the database connection
				await client.close();
				console.log("✓ MongoDB connection closed");
				process.exit(0);
			} catch (error) {
				console.error("Error during shutdown:", error);
				process.exit(1);
			}
		});

		/**
		 * SIGTERM Handler
		 * Handles graceful shutdown when the process is terminated
		 */
		process.on("SIGTERM", async () => {
			console.log("\nReceived SIGTERM signal...");
			try {
				// Close the HTTP server first to stop accepting new connections
				server.close(() => {
					console.log("✓ HTTP server closed");
				});

				// Then close the database connection
				await client.close();
				console.log("✓ MongoDB connection closed");
				process.exit(0);
			} catch (error) {
				console.error("Error during shutdown:", error);
				process.exit(1);
			}
		});

		// Return the server instance
		return server;
	} catch (error) {
		// Log the error and exit the process
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

/**
 * Start the server and handle any unhandled errors
 * This initiates the server startup process and provides
 * error handling for any unhandled errors during startup.
 */
console.log("Initializing application...");
startServer().catch((error) => {
	console.error("Unhandled error during startup:");
	console.error(error);
});

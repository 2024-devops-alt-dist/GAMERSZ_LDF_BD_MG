import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, client } from "./config/database";

// Load environment variables
dotenv.config();

// Validate environment variables
const envCheck = {
	"Server Port": process.env.PORT || "3000 (default)",
	"MongoDB Username": process.env.MONGODB_USERNAME ? "✓" : "✗",
	"MongoDB Password": process.env.MONGODB_PASSWORD ? "✓" : "✗",
};

console.log("\nEnvironment Check:");
console.log("─".repeat(30));
Object.entries(envCheck).forEach(([key, value]) => {
	console.log(`${key}: ${value}`);
});
console.log("─".repeat(30), "\n");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route with MongoDB status
app.get("/health", async (req, res) => {
	try {
		// Add MongoDB connection status to health check
		const dbStatus = await client
			.db()
			.admin()
			.ping()
			.then(() => "connected")
			.catch(() => "disconnected");
		res.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			database: dbStatus,
		});
	} catch (error) {
		res.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			database: "error",
		});
	}
});

// Start server function
async function startServer() {
	console.log("Starting application...");

	try {
		// Connect to MongoDB
		await connectToDatabase();

		// Start listening for requests
		app.listen(PORT, () => {
			console.log(`🚀 Server is running at http://localhost:${PORT}`);
			console.log(`  - curl http://localhost:${PORT}/health`);
		});

		// Handle graceful shutdown
		process.on("SIGINT", async () => {
			console.log("\nReceived SIGINT signal...");
			try {
				await client.close();
				console.log("✓ MongoDB connection closed");
				process.exit(0);
			} catch (error) {
				console.error("Error during shutdown:", error);
				process.exit(1);
			}
		});

		process.on("SIGTERM", async () => {
			console.log("\nReceived SIGTERM signal...");
			try {
				await client.close();
				console.log("✓ MongoDB connection closed");
				process.exit(0);
			} catch (error) {
				console.error("Error during shutdown:", error);
				process.exit(1);
			}
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

// Start the server
console.log("Initializing application...");
startServer().catch((error) => {
	console.error("Unhandled error during startup:");
	console.error(error);
});

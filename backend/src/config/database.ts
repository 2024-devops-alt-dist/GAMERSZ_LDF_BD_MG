import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get MongoDB credentials from environment variables
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

if (!username || !password) {
	throw new Error(
		"MongoDB credentials are not defined in environment variables"
	);
}

// Construct MongoDB connection URI
const uri = `mongodb+srv://${username}:${password}@gamerz-ldf-bd-mg.xaqey.mongodb.net/?retryWrites=true&w=majority&appName=Gamerz-ldf-bd-mg`;

// Create MongoDB client instance
export const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	connectTimeoutMS: 5000,
	socketTimeoutMS: 30000,
	maxPoolSize: 10,
});

// Database connection function
export async function connectToDatabase() {
	try {
		console.log("Attempting to connect to MongoDB...");

		// Connect to MongoDB
		await client.connect();

		// Verify connection with a ping
		await client.db("admin").command({ ping: 1 });
		console.log("✅ Successfully connected to MongoDB.");

		return client;
	} catch (error) {
		console.error("❌ MongoDB connection error details:");
		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Stack trace:", error.stack);
		} else {
			console.error("Unknown error:", error);
		}
		throw error;
	}
}

// Graceful shutdown function
export async function closeDatabaseConnection() {
	try {
		await client.close();
		console.log("📫 MongoDB connection closed.");
	} catch (error) {
		console.error("❌ Error closing MongoDB connection:", error);
		throw error;
	}
}

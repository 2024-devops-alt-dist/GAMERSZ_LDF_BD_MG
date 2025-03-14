/**
 * Database Configuration
 *
 * This file handles the MongoDB connection setup for both the native MongoDB driver
 * and Mongoose ODM. It provides functions to connect to and disconnect from the database.
 */

import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get MongoDB credentials from environment variables
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Validate that credentials are provided
if (!username || !password) {
	throw new Error(
		"MongoDB credentials are not defined in environment variables"
	);
}

// Construct MongoDB connection URI
const uri = `mongodb+srv://${username}:${password}@gamerz-ldf-bd-mg.xaqey.mongodb.net/?retryWrites=true&w=majority&appName=Gamerz-ldf-bd-mg`;

// Create MongoDB client instance with optimized settings
export const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	connectTimeoutMS: 5000, // Connection timeout after 5 seconds
	socketTimeoutMS: 30000, // Socket timeout after 30 seconds
	maxPoolSize: 10, // Maximum 10 connections in the pool
});

/**
 * Connects to MongoDB using both the native driver and Mongoose
 * @returns The MongoDB client instance
 */
export async function connectToDatabase() {
	try {
		console.log("Attempting to connect to MongoDB...");

		// Connect to MongoDB using native driver
		await client.connect();

		// Verify connection with a ping
		await client.db("admin").command({ ping: 1 });
		console.log("✅ Successfully connected to MongoDB.");

		// Also connect Mongoose for ODM functionality
		console.log("Connecting Mongoose to MongoDB...");
		await mongoose.connect(uri, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
			socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
		});
		console.log("✅ Mongoose connected to MongoDB.");

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

/**
 * Gracefully closes all database connections
 */
export async function closeDatabaseConnection() {
	try {
		// Close Mongoose connection first
		await mongoose.disconnect();
		console.log("📫 Mongoose connection closed.");

		// Then close the MongoDB native client
		await client.close();
		console.log("�� MongoDB connection closed.");
	} catch (error) {
		console.error("❌ Error closing MongoDB connection:", error);
		throw error;
	}
}

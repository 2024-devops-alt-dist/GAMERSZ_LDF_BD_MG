/**
 * Database Seed Script
 *
 * This script initializes the database with test data for development and testing purposes.
 * It creates:
 * - An admin user with full privileges
 * - A test player with approved status
 * - Several test chatrooms for different games
 *
 * The script checks if each entity already exists before creating it,
 * so it can be run multiple times without creating duplicates.
 *
 * Usage:
 * - Run directly: npx ts-node src/scripts/seed.ts
 * - Run with npm script: npm run seed
 */

import { connectToDatabase, client } from "../config/database";
import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import { ChatRoomSchema } from "../models/ChatRoom";
import bcrypt from "bcrypt";

/**
 * Main seed function that populates the database with initial data
 *
 * This asynchronous function:
 * 1. Connects to MongoDB
 * 2. Creates users if they don't exist
 * 3. Creates chatrooms if they don't exist
 * 4. Lists all created entities
 * 5. Closes the database connection
 */
async function seedDatabase() {
	try {
		// Connect to MongoDB using the configuration from config/database.ts
		console.log("Connecting to MongoDB...");
		await connectToDatabase();

		// Initialize Mongoose models
		const User = mongoose.model("User", UserSchema);
		const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

		/**
		 * Create Admin User
		 *
		 * Creates an admin user with full privileges if one doesn't already exist.
		 * The admin user has:
		 * - Username: adminUser
		 * - Email: admin@example.com
		 * - Password: adminpassword (hashed)
		 * - Role: admin
		 * - Status: approved
		 */
		const adminExists = await User.findOne({
			email: "admin@example.com",
		});
		if (!adminExists) {
			console.log("Creating admin user...");
			// Hash the password for security
			const hashedPassword = await bcrypt.hash("adminpassword", 10);
			const adminUser = new User({
				username: "adminUser",
				email: "admin@example.com",
				password: hashedPassword,
				motivation: "I am the admin",
				status: "approved",
				role: "admin",
			});
			await adminUser.save();
			console.log("Admin user created successfully!");
		} else {
			console.log("Admin user already exists.");
		}

		/**
		 * Create Test Player
		 *
		 * Creates a test player with approved status if one doesn't already exist.
		 * The test player has:
		 * - Username: testPlayer
		 * - Email: player@example.com
		 * - Password: playerpassword (hashed)
		 * - Role: player
		 * - Status: approved
		 */
		const playerExists = await User.findOne({
			email: "player@example.com",
		});
		if (!playerExists) {
			console.log("Creating test player...");
			// Hash the password for security
			const hashedPassword = await bcrypt.hash("playerpassword", 10);
			const playerUser = new User({
				username: "testPlayer",
				email: "player@example.com",
				password: hashedPassword,
				motivation: "I love gaming!",
				status: "approved",
				role: "player",
			});
			await playerUser.save();
			console.log("Test player created successfully!");
		} else {
			console.log("Test player already exists.");
		}

		/**
		 * Create Test Chatrooms
		 *
		 * Creates several test chatrooms for different games if they don't already exist.
		 * Each chatroom has:
		 * - Name: The name of the game
		 * - Game: The full name of the game
		 */
		const chatrooms = [
			{ name: "Fortnite", game: "Fortnite Battle Royale" },
			{ name: "Minecraft", game: "Minecraft" },
			{ name: "Call of Duty", game: "Call of Duty: Warzone" },
			{ name: "League of Legends", game: "League of Legends" },
		];

		// Create each chatroom if it doesn't exist
		for (const room of chatrooms) {
			const exists = await ChatRoom.findOne({ name: room.name });
			if (!exists) {
				console.log(`Creating ${room.name} chatroom...`);
				const newChatRoom = new ChatRoom(room);
				await newChatRoom.save();
				console.log(`${room.name} chatroom created successfully!`);
			} else {
				console.log(`${room.name} chatroom already exists.`);
			}
		}

		/**
		 * List Created Entities
		 *
		 * Retrieves and displays all users and chatrooms in the database.
		 * This provides a summary of what has been created or already exists.
		 */
		// Get all users (excluding passwords for security)
		const users = await User.find({}, { password: 0 });
		const allChatRooms = await ChatRoom.find();

		// Display summary of created entities
		console.log("\nDatabase seeded successfully!");
		console.log(`Users (${users.length}):`);
		users.forEach((user) => {
			console.log(
				`- ${user.username} (${user.email}): ${user.role}, ${user.status}`
			);
		});

		console.log(`\nChatrooms (${allChatRooms.length}):`);
		allChatRooms.forEach((room) => {
			console.log(`- ${room.name} (${room.game})`);
		});
	} catch (error) {
		// Log any errors that occur during seeding
		console.error("Error seeding database:", error);
	} finally {
		/**
		 * Clean Up
		 *
		 * Closes the database connections and exits the process.
		 * This ensures that the script doesn't hang after completion.
		 */
		console.log("\nClosing database connection...");
		await mongoose.disconnect();
		await client.close();
		process.exit(0);
	}
}

// Execute the seed function
seedDatabase();

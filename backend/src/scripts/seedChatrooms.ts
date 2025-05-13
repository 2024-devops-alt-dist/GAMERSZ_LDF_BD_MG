/**
 * Seed Chatrooms Script
 * 
 * This script creates initial chatrooms in the database.
 * Run this script with: npx ts-node src/scripts/seedChatrooms.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { ChatRoomSchema } from "../models/ChatRoom";
import { connectToDatabase, closeDatabaseConnection } from "../config/database";

// Load environment variables
dotenv.config();

// Initialize ChatRoom model
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

// Initial chatrooms data
const initialChatrooms = [
  {
    name: "FPS Legends",
    game: "Call of Duty",
  },
  {
    name: "Battle Arena",
    game: "League of Legends",
  },
  {
    name: "Survivors Only",
    game: "PUBG",
  },
  {
    name: "Minecraft Builders",
    game: "Minecraft",
  },
  {
    name: "FIFA Champions",
    game: "FIFA 23",
  },
];

/**
 * Seed the database with initial chatrooms
 */
async function seedChatrooms() {
  try {
    console.log("Starting chatroom seeding process...");
    
    // Connect to the database
    await connectToDatabase();
    
    // Check if chatrooms already exist
    const existingCount = await ChatRoom.countDocuments();
    console.log(`Found ${existingCount} existing chatrooms`);
    
    if (existingCount > 0) {
      console.log("Chatrooms already exist. Skipping seeding process.");
      return;
    }
    
    // Insert the chatrooms
    const result = await ChatRoom.insertMany(initialChatrooms);
    console.log(`✅ Successfully seeded ${result.length} chatrooms:`);
    
    // Log the created chatrooms with their IDs
    result.forEach((chatroom) => {
      console.log(`- ${chatroom.name} (${chatroom.game}): ${chatroom._id}`);
    });
    
  } catch (error) {
    console.error("❌ Error seeding chatrooms:", error);
  } finally {
    // Close the database connection
    await closeDatabaseConnection();
    console.log("Chatroom seeding process completed.");
  }
}

// Run the seed function
seedChatrooms();

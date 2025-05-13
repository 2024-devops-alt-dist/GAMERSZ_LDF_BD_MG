import mongoose, { Schema } from "mongoose";

export const ChatRoomSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		game: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// Create and export the ChatRoom model
export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

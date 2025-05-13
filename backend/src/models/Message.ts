import mongoose, { Schema } from "mongoose";

export const MessageSchema = new Schema(
	{
		// Use the field names that match the existing database schema
		roomId: {
			type: Schema.Types.ObjectId,
			ref: "chatRoomSchema",
			required: true,
		},
		senderId: {
			type: Schema.Types.ObjectId,
			ref: "userSchema",
			required: true,
		},
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// Create and export the Message model
export const Message = mongoose.model("Message", MessageSchema);

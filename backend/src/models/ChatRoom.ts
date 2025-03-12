import mongoose, { Schema } from 'mongoose';

export const ChatRoomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    game: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

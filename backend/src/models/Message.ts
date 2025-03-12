import { Schema } from 'mongoose';

export const MessageSchema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'chatRoomSchema',
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'userSchema', required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

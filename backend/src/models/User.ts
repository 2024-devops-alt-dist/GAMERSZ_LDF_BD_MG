import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['player', 'admin'], default: 'player' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'banned'],
      default: 'pending',
    },
    motivation: {
      type: String,
      validate: {
        validator: function (value: string) {
          return (this as any).role !== 'player' || (value && value.length > 0);
        },
        message: 'Motivation is required for non-players',
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

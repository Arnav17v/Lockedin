import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minLength: [3, 'Username must be at least 3 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// If the User model doesn't exist, create a new one
const User = models.User || mongoose.model('User', userSchema);

export default User; 
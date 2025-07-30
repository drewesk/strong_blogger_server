import mongoose, { Document, Schema, Model } from "mongoose";

// Define a User interface that extends the Mongoose Document interface
export interface User extends Document {
  googleId: string;
  displayName: string;
  email: string;
  photo: string;
  accessToken: string;
  refreshToken: string;
}

// Create the User Schema
const userSchema = new Schema<User>({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

// Create the User model
const UserModel: Model<User> = mongoose.model<User>("User", userSchema);

export default UserModel;

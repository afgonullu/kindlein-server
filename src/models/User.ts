import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: string;
}

// validation will be handled in graphql layer
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

export const User = model<IUser>("User", userSchema);

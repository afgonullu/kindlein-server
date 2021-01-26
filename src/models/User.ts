import { Schema, model } from "mongoose";
import { IUser } from "../utils/interfaces";

// validation will be handled in graphql layer
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

export const User = model<IUser>("User", userSchema);

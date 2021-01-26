import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";

import { User } from "../models/User";
import { RegisterInput, validateRegisterInput } from "../utils/validators/validateRegisterInput";
import { SECRET } from "../utils/config";
import { validateLoginInput } from "../utils/validators/validateLoginInput";
import { IUser } from "../utils/interfaces";

const generateToken = (user: IUser) =>
  jwt.sign(
    {
      id: <string>user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
    SECRET,
  );

export const getUser = async (userId: string): Promise<IUser> => {
  try {
    const user = await User.findById(userId);
    if (user) {
      // TODO: this user does not have token
      return user;
    }
    throw new Error("User not found");
  } catch (error) {
    throw new Error(error);
  }
};

export const registerUser = async (registerInput: RegisterInput) => {
  const { username, email, password, confirmPassword } = registerInput;
  // validate user input
  const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

  if (!valid) {
    throw new UserInputError("Errors occured", { errors });
  }

  // make sure user doesn't exist
  const user = await User.findOne({ username });

  if (user) {
    throw new UserInputError("Username is taken", {
      errors: {
        username: "This username is taken",
      },
    });
  }

  // hash password, create user and create token
  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = new User({
    username,
    password: passwordHash,
    email,
    createdAt: new Date().toISOString(),
  });

  const returnedUser = await newUser.save();

  const token = generateToken(returnedUser);

  return {
    success: true,
    message: "User registered, now logging in.",
    user: {
      username: returnedUser.username,
      email: returnedUser.email,
      createdAt: returnedUser.createdAt,
      token,
      id: <string>returnedUser._id,
    },
  };
};

export const loginUser = async (username: string, password: string) => {
  // validate user input
  const { errors, valid } = validateLoginInput(username, password);

  if (!valid) {
    throw new UserInputError("Errors occured", { errors });
  }

  // check if user exists
  const returnedUser = await User.findOne({ username });
  if (!returnedUser) {
    errors.general = "User not found";
    throw new UserInputError("User not found", { errors });
  }

  // user exists, check if password correct
  const match = await bcrypt.compare(password, returnedUser.password);
  if (!match) {
    errors.general = "Wrong credentials";
    throw new UserInputError("Wrong credentials", { errors });
  }

  // can safely login
  const token = generateToken(returnedUser);

  return {
    success: true,
    message: "successful login, now logging in.",
    user: {
      username: returnedUser.username,
      email: returnedUser.email,
      createdAt: returnedUser.createdAt,
      token,
      id: <string>returnedUser._id,
    },
  };
};

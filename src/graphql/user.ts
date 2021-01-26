import { RegisterInput } from "../utils/validators/validateRegisterInput";

import { getUser, registerUser, loginUser } from "../services/userService";
import { IUser } from "../utils/interfaces";

export const userDefs = `#graphql
  extend type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type UserResponse {
    success: Boolean!
    message: String
    user: User
  }

  extend type Query {
    me(userId: ID!): User!
  }

  extend type Mutation {
    register(registerInput: RegisterInput): UserResponse!
    login(username:String!, password:String!): UserResponse!
  }
`;

export const userResolvers = {
  Query: {
    me: async (_root: never, args: { userId: string }): Promise<IUser> => {
      const { userId } = args;
      return getUser(userId);
    },
  },
  Mutation: {
    register: async (_root: never, args: { registerInput: RegisterInput }) => registerUser(args.registerInput),
    login: async (_root: never, args: { username: string; password: string }) => {
      const { username, password } = args;
      return loginUser(username, password);
    },
  },
};

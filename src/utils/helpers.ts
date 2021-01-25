import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

import { IUser } from "../models/User";
import { SECRET } from "./config";

export const checkAuthorization = (context: { req: { headers: { authorization: string } } }) => {
  const auth = context.req ? context.req.headers.authorization : null;
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    try {
      const decodedToken = <IUser>jwt.verify(token, SECRET);
      return decodedToken;
    } catch (error) {
      throw new AuthenticationError("Invalid/Expired token");
    }
  }
  throw new Error("Authentication failed");
};

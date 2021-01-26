import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";

import { SECRET } from "./config";
import { ContextInput, IUser } from "./interfaces";

export const checkAuthorization = (context: ContextInput) => {
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

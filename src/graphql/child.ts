/* eslint-disable @typescript-eslint/keyword-spacing */
import { AuthenticationError } from "apollo-server-express";
import { Child, IChild } from "../models/Child";
import { checkAuthorization } from "../utils/helpers";

export const childDefs = `#graphql
  extend type Child {
    id: ID!
    name: String!
    birthDate: String!
    createdAt: String!
    createdBy: User!
    #parent: String
    moments: [Moment]!
  }

  input ChildInput {
    name: String!
    birthDate: String!
    #parent: String
  }

  type ChildResponse {
    success: Boolean!
    message: String
    child: Child
    moments: [Moment]
  }
  
  extend type Query {
    children(userId: ID!): [Child]!
    child(id: ID!): Child
  }

  extend type Mutation {
    addChild(childInput: ChildInput!): ChildResponse!
    deleteChild(id: ID!): ChildResponse!
  }
`;

export const childResolvers = {
  Query: {
    children: async (_root: never, args: { userId: string }) => {
      const { userId } = args;

      try {
        const children = await Child.find({ createdBy: userId }).populate("createdBy");
        if (children) {
          return children;
        }
        throw new Error("No children found");
      } catch (error) {
        throw new Error(error);
      }
    },
    child: async (_root: never, args: { id: string }) => {
      const { id } = args;

      try {
        const child = await Child.findById(id).populate("createdBy");
        if (child) {
          return child;
        }
        throw new Error("No children found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    addChild: async (
      _root: never,
      args: { childInput: { name: string; birthDate: string } },
      context: { req: { headers: { authorization: string } } },
    ) => {
      const { name, birthDate } = args.childInput;
      const token = checkAuthorization(context);

      const child = new Child({
        name,
        birthDate: new Date(birthDate).toString(),
        createdAt: new Date().toISOString(),
        createdBy: <string>token.id,
      });

      const returnedChild = await child.save();

      return {
        success: true,
        message: "child created successfully",
        child: returnedChild,
      };
    },
    deleteChild: async (
      _root: never,
      args: { id: string },
      context: { req: { headers: { authorization: string } } },
    ) => {
      const { id } = args;
      const token = checkAuthorization(context);

      try {
        const child = <IChild>await Child.findById(id);

        if (parseInt(child.createdBy, 10) === parseInt(token.id, 10)) {
          const returnedChild = <IChild>await child.deleteOne();
          return { success: true, message: "child deleted successfully", child: returnedChild };
        }
        throw new AuthenticationError("Action not allowed");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

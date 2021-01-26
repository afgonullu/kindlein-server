import { addChild, deleteChild, getChild, getChildren } from "../services/childService";
import { checkAuthorization } from "../utils/helpers";
import { ChildResponse, ContextInput, IChild } from "../utils/interfaces";

export const childDefs = `#graphql
  extend type Child {
    id: ID!
    name: String!
    birthDate: String!
    createdAt: String!
    createdBy: String!
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
    children: async (_root: never, args: { userId: string }): Promise<IChild[]> => {
      const { userId } = args;
      return getChildren(userId);
    },
    child: async (_root: never, args: { id: string }): Promise<IChild> => {
      const { id } = args;

      return getChild(id);
    },
  },
  Mutation: {
    addChild: async (
      _root: never,
      args: { childInput: { name: string; birthDate: string } },
      context: ContextInput,
    ): Promise<ChildResponse> => {
      const token = checkAuthorization(context);

      return addChild(args.childInput, token.id);
    },
    deleteChild: async (_root: never, args: { id: string }, context: ContextInput): Promise<ChildResponse> => {
      const token = checkAuthorization(context);

      return deleteChild(args.id, token.id);
    },
  },
};

import { IChild } from "../models/Child";
import { IMoment } from "../models/Moment";
// eslint-disable-next-line import/no-cycle
import { addMoment, deleteMoment, getMoment, getMoments, likeMoment } from "../services/momentService";
import { checkAuthorization } from "../utils/helpers";

export interface MomentResponse {
  success: boolean;
  message: string;
  moment?: IMoment;
  child?: IChild;
}

export interface MomentInput {
  title: string;
  body: string;
  belongsTo: string;
  momentDate: string;
  location: string;
}

export const momentDefs = `#graphql
  #type Tag {
  #  id: ID!
  #  body: String!
  #  createdAt: String!
  #  moments: [Moment]!
  #}

  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  extend type Moment {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
    createdBy: String!
    belongsTo: Child!
    momentDate: String!
    location: String!
    #tags: [Tag]!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  input MomentInput {
    title: String!
    body: String!
    belongsTo: String!
    momentDate: String!
    location: String!
    #tags: [String]!
  }

  type MomentResponse {
    success: Boolean!
    message: String
    moment: Moment
    child: Child
    #tags: [Tag]
  }
  
  extend type Query {
    moments: [Moment]!
    moment(id: ID!): Moment
  }

  extend type Mutation {
    addMoment(momentInput: MomentInput!): MomentResponse!
    deleteMoment(id: ID!): MomentResponse!
    likeMoment(id: ID!): MomentResponse!
    addComment(id: ID!, body: String!): MomentResponse!
    deleteComment(id: ID!, momentId: ID!): Moment!
  }
`;

export const momentResolvers = {
  Query: {
    moments: async (): Promise<IMoment[]> => getMoments(),
    moment: async (_root: never, args: { id: string }): Promise<IMoment> => getMoment(args.id),
  },
  Mutation: {
    addMoment: async (
      _root: never,
      args: { momentInput: MomentInput },
      context: { req: { headers: { authorization: string } } },
    ): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return addMoment(args.momentInput, token.id);
    },
    deleteMoment: async (
      _root: never,
      args: { id: string },
      context: { req: { headers: { authorization: string } } },
    ): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return deleteMoment(args.id, token.id);
    },
    likeMoment: async (
      _root: never,
      args: { id: string },
      context: { req: { headers: { authorization: string } } },
    ): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return likeMoment(args.id, token.username);
    },
  },
};

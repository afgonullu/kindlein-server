import {
  addComment,
  addMoment,
  deleteComment,
  deleteMoment,
  getMoment,
  getMoments,
  likeMoment,
} from "../services/momentService";
import { checkAuthorization } from "../utils/helpers";
import { ContextInput, IMoment, MomentInput, MomentResponse } from "../utils/interfaces";

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
    comment: Comment
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

  extend type Subscription {
    newComment: Moment!
  }
`;

export const momentResolvers = {
  Moment: {
    likeCount: (root: { likes: string | any[] }) => root.likes.length,
    commentCount: (root: { comments: string | any[] }) => root.comments.length,
  },
  Query: {
    moments: async (): Promise<IMoment[]> => getMoments(),
    moment: async (_root: never, args: { id: string }): Promise<IMoment> => getMoment(args.id),
  },
  Mutation: {
    addMoment: async (
      _root: never,
      args: { momentInput: MomentInput },
      context: ContextInput,
    ): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return addMoment(args.momentInput, token.id);
    },
    deleteMoment: async (_root: never, args: { id: string }, context: ContextInput): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return deleteMoment(args.id, token.id);
    },
    likeMoment: async (_root: never, args: { id: string }, context: ContextInput): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      return likeMoment(args.id, token.username);
    },
    addComment: async (
      _root: never,
      args: { id: string; body: string },
      context: ContextInput,
    ): Promise<MomentResponse> => {
      const token = checkAuthorization(context);

      const result = await addComment(args.id, args.body, token.username);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      context.pubsub.publish("NEW_COMMENT", { newComment: result.moment });

      return result;
    },
    deleteComment: async (
      _root: never,
      args: { id: string; momentId: string },
      context: ContextInput,
    ): Promise<IMoment> => {
      const token = checkAuthorization(context);

      return deleteComment(args.id, args.momentId, token.username);
    },
  },
  Subscription: {
    newComment: {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      subscribe: (_root: never, _args: never, context: ContextInput) => context.pubsub.asyncIterator("NEW_COMMENT"),
    },
  },
};

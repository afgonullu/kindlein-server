/* eslint-disable @typescript-eslint/keyword-spacing */
import { AuthenticationError } from "apollo-server-express";
import { Child, IChild } from "../models/Child";
import { IMoment, Moment } from "../models/Moment";
import { checkAuthorization } from "../utils/helpers";

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
    createdBy: User!
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
    moments: async () => {
      try {
        const moments = await Moment.find().sort({ createdAt: -1 });

        if (moments) {
          return moments;
        }
        throw new Error("No Moments found");
      } catch (error) {
        throw new Error(error);
      }
    },
    moment: async (_root: never, args: { id: string }) => {
      const { id } = args;

      try {
        const moment = await Moment.findById(id);
        if (moment) {
          return moment;
        }
        throw new Error("No children found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    addMoment: async (
      _root: never,
      args: { momentInput: { title: string; body: string; momentDate: string; location: string; belongsTo: string } },
      context: { req: { headers: { authorization: string } } },
    ) => {
      const { title, body, momentDate, location, belongsTo } = args.momentInput;
      const token = checkAuthorization(context);

      const childInDb = <IChild>await Child.findById(belongsTo);

      const moment = new Moment({
        title,
        body,
        momentDate: new Date(momentDate).toString(),
        createdAt: new Date().toISOString(),
        location,
        belongsTo: <string>childInDb._id,
        createdBy: <string>token.id,
      });

      const returnedMoment = await moment.save();
      childInDb.moments.push(returnedMoment.id);
      await childInDb.save();

      return {
        success: true,
        message: "moment created",
        moment: returnedMoment,
        child: childInDb,
      };
    },
    deleteMoment: async (
      _root: any,
      args: { id: string },
      context: { req: { headers: { authorization: string } } },
    ) => {
      const { id } = args;

      const token = checkAuthorization(context);

      try {
        const moment = <IMoment>await Moment.findById(id);
        if (moment?.createdBy.id === token.id) {
          const returnedMoment = <IMoment>await moment.delete();

          const childInDb = <IChild>await Child.findById(returnedMoment.belongsTo);

          return { success: true, message: "moment deleted", moment: returnedMoment, child: childInDb };
        }
        throw new AuthenticationError("Action not allowed");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

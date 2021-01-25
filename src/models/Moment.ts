import { Schema, model, Document } from "mongoose";
// eslint-disable-next-line import/no-cycle
import { IChild } from "./Child";

export interface IMoment extends Document {
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
  belongsTo: IChild;
  momentDate: string;
  location: string;
  comments: {
    body: string;
    username: string;
    createdAt: string;
  }[];
  likes: {
    username: string;
    createdAt: string;
  }[];
}

// validation will be handled in graphql layer
const momentSchema = new Schema({
  title: String,
  body: String,
  createdAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: "Child",
    autopopulate: true,
  },
  momentDate: String,
  location: String,
  // tags: [
  //   {
  //     body: String,
  //     username: String,
  //     createdAt: String,
  //   },
  // ],
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
momentSchema.plugin(require("mongoose-autopopulate"));

export const Moment = model<IMoment>("Moment", momentSchema);

import { Schema, model, Document } from "mongoose";

export interface IChild extends Document {
  name: string;
  birthDate: string;
  createdAt: string;
  createdBy: string;
  moments: string[];
}

// validation will be handled in graphql layer
const childSchema = new Schema({
  name: String,
  birthDate: String,
  createdAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  moments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Moment",
    },
  ],
});

export const Child = model<IChild>("Child", childSchema);

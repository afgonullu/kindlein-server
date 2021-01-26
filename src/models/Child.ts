import { Schema, model } from "mongoose";
import { IChild } from "../utils/interfaces";

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
      autopopulate: true,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
childSchema.plugin(require("mongoose-autopopulate"));

export const Child = model<IChild>("Child", childSchema);

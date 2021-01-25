import { Schema, model, Document } from "mongoose";
// eslint-disable-next-line import/no-cycle
import { IMoment } from "./Moment";

export interface IChild extends Document {
  name: string;
  birthDate: string;
  createdAt: string;
  createdBy: string;
  moments: IMoment[];
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
      autopopulate: true,
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
childSchema.plugin(require("mongoose-autopopulate"));

export const Child = model<IChild>("Child", childSchema);

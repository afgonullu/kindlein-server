import { AuthenticationError, UserInputError } from "apollo-server-express";
// eslint-disable-next-line import/no-cycle
import { MomentInput, MomentResponse } from "../graphql/moment";
import { Child, IChild } from "../models/Child";
import { IMoment, Moment } from "../models/Moment";

export const getMoments = async (): Promise<IMoment[]> => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 });

    if (moments) {
      return moments;
    }
    throw new Error("No Moments found");
  } catch (error) {
    throw new Error(error);
  }
};

export const getMoment = async (id: string): Promise<IMoment> => {
  try {
    const moment = await Moment.findById(id);
    if (moment) {
      return moment;
    }
    throw new Error("No children found");
  } catch (error) {
    throw new Error(error);
  }
};

export const addMoment = async (momentInput: MomentInput, tokenId: string): Promise<MomentResponse> => {
  const { title, body, momentDate, location, belongsTo } = momentInput;

  // eslint-disable-next-line @typescript-eslint/keyword-spacing
  const childInDb = <IChild>await Child.findById(belongsTo);

  const moment = new Moment({
    title,
    body,
    momentDate: new Date(momentDate).toString(),
    createdAt: new Date().toISOString(),
    location,
    belongsTo: <string>childInDb._id,
    createdBy: tokenId,
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
};

export const deleteMoment = async (id: string, tokenId: string): Promise<MomentResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/keyword-spacing
    const moment = <IMoment>await Moment.findById(id);
    console.log(moment.createdBy);
    if (parseInt(moment.createdBy, 10) === parseInt(tokenId, 10)) {
      // eslint-disable-next-line @typescript-eslint/keyword-spacing
      const returnedMoment = <IMoment>await moment.delete();

      // eslint-disable-next-line @typescript-eslint/keyword-spacing
      const childInDb = <IChild>await Child.findById(returnedMoment.belongsTo);

      return { success: true, message: "moment deleted", moment: returnedMoment, child: childInDb };
    }
    throw new AuthenticationError("Action not allowed");
  } catch (error) {
    throw new Error(error);
  }
};

export const likeMoment = async (id: string, username: string): Promise<MomentResponse> => {
  const moment = await Moment.findById(id);

  if (moment) {
    if (moment.likes.find((like) => like.username === username)) {
      // moment already liked by the user, unlike it
      moment.likes = moment.likes.filter((like) => like.username !== username);
    } else {
      // not liked, like it
      moment.likes.push({
        username,
        createdAt: new Date().toISOString(),
      });
    }
    const returnedMoment = await moment.save();
    return { success: true, message: "moment like/unlike", moment: returnedMoment };
  }
  throw new UserInputError("Moment not found");
};

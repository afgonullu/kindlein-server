import { AuthenticationError } from "apollo-server-express";
// eslint-disable-next-line import/no-cycle
import { ChildResponse } from "../graphql/child";
import { Child, IChild } from "../models/Child";
import { Moment } from "../models/Moment";

export const getChildren = async (userId: string): Promise<IChild[]> => {
  try {
    const children = await Child.find({ createdBy: userId });

    if (children) {
      return children;
    }
    throw new Error("No children found");
  } catch (error) {
    throw new Error(error);
  }
};

export const getChild = async (id: string): Promise<IChild> => {
  try {
    const child = await Child.findById(id);
    if (child) {
      return child;
    }
    throw new Error("No children found");
  } catch (error) {
    throw new Error(error);
  }
};

export const addChild = async (
  childInput: { name: string; birthDate: string },
  tokenId: string,
): Promise<ChildResponse> => {
  const { name, birthDate } = childInput;

  const child = new Child({
    name,
    birthDate: new Date(birthDate).toString(),
    createdAt: new Date().toISOString(),
    createdBy: tokenId,
  });

  const returnedChild = await child.save();

  return {
    success: true,
    message: "child created successfully",
    child: returnedChild,
  };
};

export const deleteChild = async (id: string, tokenId: string): Promise<ChildResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/keyword-spacing
    const child = <IChild>await Child.findById(id);

    if (parseInt(child.createdBy, 10) === parseInt(tokenId, 10)) {
      await Moment.deleteMany({ belongsTo: <string>child.id });
      // eslint-disable-next-line @typescript-eslint/keyword-spacing
      const returnedChild = <IChild>await child.deleteOne();
      return { success: true, message: "child deleted successfully", child: returnedChild };
    }
    throw new AuthenticationError("Action not allowed");
  } catch (error) {
    throw new Error(error);
  }
};

/* eslint-disable @typescript-eslint/keyword-spacing */
import { AuthenticationError } from "apollo-server-express";
import { ChildResponse } from "../graphql/child";
import { Child, IChild } from "../models/Child";

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
    const child = <IChild>await Child.findById(id);

    if (parseInt(child.createdBy, 10) === parseInt(tokenId, 10)) {
      const returnedChild = <IChild>await child.deleteOne();
      return { success: true, message: "child deleted successfully", child: returnedChild };
    }
    throw new AuthenticationError("Action not allowed");
  } catch (error) {
    throw new Error(error);
  }
};

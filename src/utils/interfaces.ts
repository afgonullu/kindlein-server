import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: string;
}

export interface IChild extends Document {
  name: string;
  birthDate: string;
  createdAt: string;
  createdBy: string;
  moments: IMoment[];
}

export interface IMoment extends Document {
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
  belongsTo: IChild;
  momentDate: string;
  location: string;
  comments: {
    id?: string;
    body: string;
    username: string;
    createdAt: string;
  }[];
  likes: {
    username: string;
    createdAt: string;
  }[];
}

export interface ChildResponse {
  success: boolean;
  message: string;
  child?: IChild;
  moments?: IMoment[];
}

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

export interface ContextInput {
  req: { headers: { authorization: string } };
}

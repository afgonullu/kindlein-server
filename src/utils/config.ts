import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URI = <string>process.env.MONGODB_URI;
export const SECRET = <string>process.env.SECRET;
export const PORT = <string>process.env.PORT;

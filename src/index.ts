import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql/schema";

import { MONGODB_URI } from "./utils/config";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error: { message: string }) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const app = express();
const server = new ApolloServer({
  schema,
});

server.applyMiddleware({ app });

app.use((_req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));

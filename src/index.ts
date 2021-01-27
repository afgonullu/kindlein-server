import http from "http";
import express from "express";
import mongoose from "mongoose";
import { ApolloServer, PubSub } from "apollo-server-express";

import { schema } from "./graphql/schema";
import { MONGODB_URI, PORT } from "./utils/config";

// connect to db
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

// create event generator factory
const pubsub = new PubSub();

// create an express app that accepts GraphQL HTTP connections
const app = express();
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req, pubsub }),
});

server.applyMiddleware({ app });

app.use((_req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

// create exppress app server
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql/schema";

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

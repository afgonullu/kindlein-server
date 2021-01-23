import { makeExecutableSchema } from "@graphql-tools/schema";
import { bookDefs, bookResolvers } from "./book";

const typeDefs = [bookDefs];
const resolvers = [bookResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

import { makeExecutableSchema } from "@graphql-tools/schema";

import { BaseDefs } from "./_types";
import { bookDefs, bookResolvers } from "./book";
import { momentDefs, momentResolvers } from "./moment";

const typeDefs = [BaseDefs, bookDefs, momentDefs];
const resolvers = [bookResolvers, momentResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

import { makeExecutableSchema } from "@graphql-tools/schema";

import { BaseDefs } from "./_types";
import { userDefs, userResolvers } from "./user";
import { momentDefs, momentResolvers } from "./moment";

const typeDefs = [BaseDefs, userDefs, momentDefs];
const resolvers = [userResolvers, momentResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

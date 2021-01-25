import { makeExecutableSchema } from "@graphql-tools/schema";

import { BaseDefs } from "./_types";
import { userDefs, userResolvers } from "./user";
import { childDefs, childResolvers } from "./child";
import { momentDefs, momentResolvers } from "./moment";

const typeDefs = [BaseDefs, userDefs, childDefs, momentDefs];
const resolvers = [userResolvers, childResolvers, momentResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

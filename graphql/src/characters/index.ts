import { readFileSync } from "fs";
import { resolvers } from "./resolvers.js";

const typeDef = readFileSync('./src/characters/schema.graphql', { encoding: 'utf-8' })

export const characters =  {
  resolvers,
  typeDef,
};
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from "@prisma/client";

import { characterClasses } from './characterClasses/index.js';
import { characters } from './characters/index.js'

const prisma = new PrismaClient();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type User {
    id: Int
    name: String
    email: String
  }

  type Query
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        characterClasses: () => prisma.characterClass.findMany(),
        characters: (userId: number) => prisma.character.findMany({
            where: {
                userId: userId
            }
        })
    },
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs: [typeDefs, characterClasses.typeDef, characters.typeDef],
    resolvers: [characterClasses.resolvers, characters.resolvers],
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
  });
  
  console.log(`🚀 yay! Server ready at: ${url}`);
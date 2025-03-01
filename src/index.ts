import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from "@prisma/client";

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

  type CharacterClass {
    id: Int
    name: String
    baseHp: Int
    baseMp: Int
    baseAttack: Int
    baseDefense: Int
  }

  type Character {
    id: Int
    name: String
    user: User
    class: CharacterClass
    level: Int
    currentHp: Int
    maxHp: Int
    attack: Int
    defense: Int
    experience: Int
  }

  type Query {
    characterClasses: [CharacterClass]
    characters: [Character]
  }
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
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
  });
  
  console.log(`🚀 yay Server ready at: ${url}`);
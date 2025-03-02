import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { characterClasses } from './characterClasses/index.js';
import { characters } from './characters/index.js';
import { users } from './users/index.js';

const typeDefs = `#graphql
  type Query
`;

const server = new ApolloServer({
    typeDefs: [typeDefs, characterClasses.typeDef, characters.typeDef, users.typeDef],
    resolvers: [characterClasses.resolvers, characters.resolvers],
});
  
const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
});

console.log(`🚀 yay! Server ready at: ${url}`);
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { characterClasses } from './characterClasses/index.js';
import { characters } from './characters/index.js';
import { users } from './users/index.js';
import jwt from 'jsonwebtoken';
import { getContext } from './utils/context.js'
import 'dotenv/config';

const typeDefs = `#graphql
  type Query
  type Mutation
`;

const server = new ApolloServer({
    typeDefs: [typeDefs, characterClasses.typeDef, characters.typeDef, users.typeDef],
    resolvers: [characterClasses.resolvers, characters.resolvers, users.resolvers]
});
  
const { url } = await startStandaloneServer(server, {
    context: async ({req, res}) => getContext({req, res}),
    listen: { port: 8080 },
});

console.log(`🚀 yay! Server ready at: ${url}`);
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
`;

const server = new ApolloServer({
    typeDefs: [typeDefs, characterClasses.typeDef, characters.typeDef, users.typeDef],
    resolvers: [characterClasses.resolvers, characters.resolvers, users.resolvers]
});
  
const { url } = await startStandaloneServer(server, {
    context: async ({req, res}) => getContext({req, res}),
    //   {
    //   console.log('hello?');
    //   // Get the user token from the headers.
    //   const token = req.headers.authorization || '';

    //   if (!token) return;
    //   // Try to retrieve a user with the token
    //   const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);
    //   const user = decoded;

    //   console.log(user);
    //   // Add the user to the context
    //   return { user };
    // },
    listen: { port: 8080 },
});

console.log(`🚀 yay! Server ready at: ${url}`);
import { GraphQLError } from 'graphql'
import 'dotenv/config'
import { Resolvers } from '../generated/graphql.js';

export const resolvers: Resolvers = {
    Query: {
        me: (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                    },
                });
            }
            
            return context.user;
        }
    },
    Mutation: {
        register: async (_: any, { email, username, password }: any, context: any) => {
            return await context.service.user.register({ email, username, password })
        },
        login: async (_: any, { username, password }: any, context: any) => {
            return await context.service.user.login({ username, password })
        }
    }
}
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql'
import { createHash } from 'crypto'
import { PrismaClient } from "@prisma/client";
import { register, login } from './userService.js'
import 'dotenv/config'

export const resolvers = {
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
            //return await register({email, username, password});
            return await context.service.user.register({email, username, password})
        },
        login: async (_: any, { username, password }: any, context: any) => {
            //return await login({ username, password })
            return await context.service.user.login({username, password})
        }
    }
}
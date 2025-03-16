import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql'
import { createHash } from 'crypto'
import { PrismaClient } from "@prisma/client";
import 'dotenv/config'

const prisma = new PrismaClient();

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
        register: async (_: any, { email, username, password }: any) => {
            const hashedPassword = createHash('sha256').update(password).digest('hex');

            let user = await prisma.user.create({
                data: {
                    name: username,
                    email: email,
                    password: hashedPassword
                }
            });

            const token = jwt.sign({ id: user.id, email }, process.env.JWT_KEY, { expiresIn: '1h' });

            return { token, user: user };
        },
        login: async (_: any, { username, password }: any) => {
            const hashedPassword = createHash('sha256').update(password).digest('hex');
            console.log(hashedPassword);

            let user = await prisma.user.findUnique({
                where: {
                    name: username
                }
            });

            if (!user) {
                throw new GraphQLError('User name or password incorrect.', {
                    extensions: {
                        code: 'FORBIDDEN',
                    },
                });
            }

            const isValid = hashedPassword === user.password;

            if (!isValid) {
                throw new GraphQLError('User name or password incorrect.', {
                    extensions: {
                        code: 'FORBIDDEN',
                    },
                });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' });

            return { token, user: user };
        }
    }
}
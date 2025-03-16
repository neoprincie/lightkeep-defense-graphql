import { createHash } from 'crypto';
import prisma from '../wrappers/prismaWrapper.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql/error';

export const register = async ({ email, username, password }: any) => {
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
}

export const login = async ({ username, password }: any) => {
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
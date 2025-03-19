//import { createHash } from 'crypto';
import { encrypt } from '../utils/encryption.js';
import prisma from '../utils/prismaWrapper.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

export const register = async ({ email, username, password }: any) => {
    //const hashedPassword = createHash('sha256').update(password).digest('hex');
    const hashedPassword = encrypt(password);

    await checkForUniqueUserName(username);
    await checkForUniqueEmail(email);

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
    //const hashedPassword = createHash('sha256').update(password).digest('hex');
    const hashedPassword = encrypt(password); 

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

const checkForUniqueUserName = async (username) => {
    let user = await prisma.user.findUnique({
        where: {
            name: username
        }
    })

    if (user) {
        throw new GraphQLError('User name already in use.')
    }
}

const checkForUniqueEmail = async (email) => {
    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (user) {
        throw new GraphQLError('Email already in use.')
    }
}
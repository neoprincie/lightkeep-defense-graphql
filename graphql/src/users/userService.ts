import { encrypt } from '../utils/encryption.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { AuthPayload } from '../generated/graphql.js';

export interface IUserService {
    register({ email, username, password }: { email: string, username: string, password: string }): Promise<AuthPayload>
    login({ username, password } : { username: string, password: string }): Promise<AuthPayload>
}

export class UserService implements IUserService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async register({ email, username, password }: { email: string, username: string, password: string }): Promise<AuthPayload> {
        const hashedPassword = encrypt(password);
    
        await this.checkForUniqueUserName(username);
        await this.checkForUniqueEmail(email);
    
        let user = await this.prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword
            }
        });
    
        const token = jwt.sign({ id: user.id, email }, process.env.JWT_KEY, { expiresIn: '1h' });
    
        return { token, user: user };
    }
    
    async login ({ username, password } : { username: string, password: string }): Promise<AuthPayload> {
        const hashedPassword = encrypt(password); 
        
        let user = await this.prisma.user.findUnique({
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
    
    private async checkForUniqueUserName(username: string) {
        let user = await this.prisma.user.findUnique({
            where: {
                name: username
            }
        })
    
        if (user) {
            throw new GraphQLError('User name already in use.')
        }
    }
    
    private async checkForUniqueEmail(email: string) {
        let user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    
        if (user) {
            throw new GraphQLError('Email already in use.')
        }
    }
}
import { beforeAll, afterAll, test, expect, describe } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process'
import { PrismaClient } from "@prisma/client";
import { createHash } from 'crypto'
import { ApolloServer } from '@apollo/server'
//import prisma, { resetPrismaClient } from '../utils/prismaWrapper.js'


import { users } from './index.js'
import { getContext } from '../utils/context.js'
import { UserService } from './userService.js'
import { startStandaloneServer } from '@apollo/server/dist/esm/standalone/index.js';

let container: StartedPostgreSqlContainer
let server: any
let prisma: PrismaClient

describe('user integration tests', () =>{
    beforeAll(async () => {
        container = await new PostgreSqlContainer().start()
        process.env.DATABASE_URL = container.getConnectionUri()

        execSync('npx prisma migrate deploy', { env: process.env, stdio: 'inherit' });

        //resetPrismaClient()
        prisma = new PrismaClient()
        //const userService = new UserService(prisma)

        console.log(await prisma.user.findMany())
        
        await prisma.user.create({
            data: {
                name: "princie",
                email: "bryprinc@gmail.com",
                password: createHash('sha256').update('supersecret').digest('hex')
            }
        });

        server = new ApolloServer({ 
            typeDefs: [`type Query`, users.typeDef], 
            resolvers: users.resolvers
        }) as any
    }, 60000)

    afterAll(async () => {
        console.log('stopping?')
        await container.stop();
    }, 60000)

    test('try out test container', async () => {
        const response: any = await server.executeOperation({
            query: `#graphql
                mutation Login($username: String!, $password: String!) {
                    login(username: $username, password: $password) {
                        token
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            `,
            variables: {
                username: 'princie',
                password: 'supersecret'
            }
        },
        {
            contextValue: getContext({req: null, res: null})
        })

        const payload = response.body.singleResult.data.login;

        //expect(payload.token).toBe('verycooltoken')
        expect(payload.user.name).toBe('princie')

        console.log(await prisma.user.findMany())
    })

    test('try out register', async () => {
        const response: any = await server.executeOperation({
            query: `#graphql
                mutation Register($email: String!, $username: String!, $password: String!) {
                    register(email: $email, username: $username, password: $password) {
                        user {
                            name
                            email
                            id
                        }
                        token
                    }
                }
            `,
            variables: {
                username: 'testuser2',
                email: 'testuser2@example.com',
                password: 'supersecret'
            }
        },
        {
            contextValue: getContext({req: null, res: null})
        })

        const payload = response.body.singleResult.data.register;

        console.log(await prisma.user.findMany())
        //expect(payload.token).toBe('verycooltoken')
        expect(payload.user.name).toBe('testuser2')
    })
})
import { beforeAll, afterAll, test, expect, describe } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process'
import { PrismaClient } from "@prisma/client";
import { createHash } from 'crypto'
import { ApolloServer, GraphQLResponse } from '@apollo/server'
import { users } from './index.js'
import { getContext } from '../utils/context.js'
import { AuthPayload } from '../generated/graphql.js';

let container: StartedPostgreSqlContainer
let server: ApolloServer
let prisma: PrismaClient

describe('user integration tests', () =>{
    beforeAll(async () => {
        container = await new PostgreSqlContainer().start()
        process.env.DATABASE_URL = container.getConnectionUri()
        process.env.JWT_KEY = "supersecretjwtkey"

        execSync('npx prisma migrate deploy', { env: process.env, stdio: 'inherit' });

        prisma = new PrismaClient()
        
        await prisma.user.create({
            data: {
                name: "testuser",
                email: "testuser@example.com",
                password: createHash('sha256').update('correcthorsebatterystaple').digest('hex')
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

    test('login should log in with valid credentials', async () => {
        type LoginResponse = {
            login: AuthPayload
        }

        const response: GraphQLResponse<LoginResponse> = await server.executeOperation({
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
                username: 'testuser',
                password: 'correcthorsebatterystaple'
            }
        },
        {
            contextValue: getContext({req: null, res: null})
        })

        let actual: AuthPayload
        console.log(JSON.stringify(response))
        if (response.body.kind === 'single' && response.body.singleResult.data) {
            actual = response.body.singleResult.data.login
        }

        expect(actual.user.name).toBe('testuser')
    })

    test('register should create a new user', async () => {
        type RegisterResponse = {
            register: AuthPayload
        }

        const response: GraphQLResponse<RegisterResponse> = await server.executeOperation({
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

        let actual: AuthPayload
        if (response.body.kind === 'single' && response.body.singleResult.data) {
            actual = response.body.singleResult.data.register
        }

        expect(actual.user.name).toBe('testuser2')
    })
})
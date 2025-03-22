import { ApolloServer } from '@apollo/server'
import { expect, test } from 'vitest'

import { typeDef } from './typeDef.js'

let testServer: ApolloServer

const createTestServer = (mockResolvers) => {
    return new ApolloServer({
        typeDefs: [`type Query`, typeDef],
        resolvers: mockResolvers
    })
}

test('me query returns User', async () => {
    const mockResolvers = {
        Query: {
            me: () => {
                return {
                    id: 1,
                    name: 'myself',
                    email: 'myself@example.com'
                }
            }
        }
    }

    testServer = createTestServer(mockResolvers)

    const response: any = await testServer.executeOperation({
        query: `#graphql
            query GetMe {
                me {
                    id
                    name
                    email
                }
            }
        `
    })

    const me = response.body.singleResult.data.me;

    expect(me.id).toBe(1)
    expect(me.name).toBe('myself')
    expect(me.email).toBe('myself@example.com')
})

test('login mutation returns AuthPayload', async () => {
    const mockResolvers = {
        Mutation: {
            login: (_, { username, password }) => {
                return {
                    token: 'verycooltoken',
                    user: {
                        id: 1,
                        name: 'myself',
                        email: 'myself@example.com'
                    }
                }
            }
        }
    }

    testServer = createTestServer(mockResolvers)

    const response: any = await testServer.executeOperation({
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
            username: 'myself',
            password: 'correcthorsebatterystaple'
        }
    })

    const payload = response.body.singleResult.data.login;

    expect(payload.token).toBe('verycooltoken')
})
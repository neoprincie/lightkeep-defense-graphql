import { describe, vi, test, expect, afterEach, beforeEach, beforeAll } from 'vitest'
import { register, login, UserService, IUserService } from './userService.js'

import { resolvers } from './resolvers.js'
import { GraphQLError } from 'graphql'
import { ApolloServer, GraphQLResponse } from '@apollo/server'
import { readFileSync } from 'fs'
import { AuthPayload, User } from '../generated/graphql.js'

const testUser = {
    id: 1,
    name: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedpassword'
}

vi.mock('./userService.js', () => ({
    register: vi.fn(),
    login: vi.fn()
}))

const mockUserService: IUserService = {
    register: vi.fn(),
    login: vi.fn()
}

const testAuthPayload: AuthPayload = {
    token: 'verycooltoken',
    user: {
        id: 1,
        name: 'testuser',
        email: 'testuser@example.com'
    }
}

const mockContext = {
    service: {
        user: mockUserService
    }
}

const callResolver = async <T>(
    resolver: any, // Loosen type restriction
    args: any,
    context: any = {}
): Promise<T> => {
    if (!resolver) throw new Error("Resolver not implemented");
    return resolver({}, args, context, {}); // Pass all four arguments
}

describe('user resolver tests', () => {
    let server: ApolloServer
    const typeDef = readFileSync('./src/users/schema.graphql', { encoding: 'utf-8' })

    beforeEach(() => {
        server = new ApolloServer({ 
            typeDefs: [`type Query`, typeDef], 
            resolvers: resolvers
        })
    })

    test('register resolver', async () => {
        mockUserService.register = vi.fn().mockResolvedValue(testAuthPayload)

        type RegisterResponse = {
            register: AuthPayload
        }

        const response: GraphQLResponse<RegisterResponse> = await server.executeOperation({
            query: `#graphql
                mutation Register($email: String!, $username: String!, $password: String!) {
                    register(email: $email, username: $username, password: $password) {
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
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'correcthorsebatterystaple'
            }
        },
        {
            contextValue: mockContext
        })

        let actual: AuthPayload
        if (response.body.kind === 'single' && response.body.singleResult.data) {
            actual = response.body.singleResult.data.register
        }

        expect(mockUserService.register).toHaveBeenCalledWith({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })
    
        expect(actual).toEqual({
            token: 'verycooltoken',
            user: {
                id: 1,
                name: 'testuser',
                email: 'testuser@example.com'
            }
        })
    })

    test('login resolver', async () => {
        mockUserService.login = vi.fn().mockResolvedValue(testAuthPayload)

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
            contextValue: mockContext
        })

        let actual: AuthPayload
        if (response.body.kind === 'single' && response.body.singleResult.data) {
            actual = response.body.singleResult.data.login
        }

        expect(mockUserService.login).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })
    
        expect(actual).toEqual({
            token: 'verycooltoken',
            user: {
                id: 1,
                name: 'testuser',
                email: 'testuser@example.com'
            }
        })
    })

    test('me resolver with user context', async () => {
        const context = { user: testUser }

        type MeResponse = {
            me: User
        }

        const response: GraphQLResponse<MeResponse> = await server.executeOperation({
            query: `#graphql
                query Me {
                    me {
                        id
                        name
                        email
                    }
                }
            `
        },
        {
            contextValue: context
        })

        let actual: User
        if (response.body.kind === 'single' && response.body.singleResult.data) {
            actual = response.body.singleResult.data.me
        }

        expect(actual).toEqual({
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com'
        })
    })

    test('me resolver not authorized', async () => {
        let error

        const response = await server.executeOperation({
            query: `#graphql
                query Me {
                    me {
                        id
                        name
                        email
                    }
                }
            `
        })

        let actual
        if (response.body.kind === 'single' && response.body.singleResult.errors) {
            actual = response.body.singleResult.errors
        }

        expect(actual[0].message).toBe('You are not authorized to perform this action.')
        expect(actual[0].extensions.code).toBe('FORBIDDEN')
    })
})
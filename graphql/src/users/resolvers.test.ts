import { describe, vi, test, expect, afterEach } from 'vitest'
import { register, login, UserService } from './userService.js'

import { resolvers } from './resolvers.js'
import { GraphQLError } from 'graphql'

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

test('register resolver', async () => {
    vi.mocked(register).mockResolvedValue({
        token: 'verycooltoken',
        user: {
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        }
    })

    const actual = await resolvers.Mutation.register({}, {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'correcthorsebatterystaple'
    }, {})

    expect(register).toHaveBeenCalledWith({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'correcthorsebatterystaple'
    })

    expect(actual).toEqual({
        token: 'verycooltoken',
        user: {
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        }
    })
})

test('login resolver', async () => {
    vi.mocked(login).mockResolvedValue({
        token: 'verycooltoken',
        user: {
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        }
    })

    const actual = await resolvers.Mutation.login({}, {
        username: 'testuser',
        password: 'correcthorsebatterystaple'
    }, {})

    expect(login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'correcthorsebatterystaple'
    })

    expect(actual).toEqual({
        token: 'verycooltoken',
        user: {
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        }
    })
})

test('me resolver with user context', () => {  
    const context = { user: testUser }

    const actual = resolvers.Query.me({}, {}, context)

    expect(actual).toBe(testUser)
})

test('me resolver not authorized', () => {
    try {
        resolvers.Query.me({}, {}, {})
    } 
    catch(error) {
        expect(error).toBeInstanceOf(GraphQLError)
        expect(error.message).toBe('You are not authorized to perform this action.')
        expect(error.extensions.code).toBe('FORBIDDEN')
    }
})
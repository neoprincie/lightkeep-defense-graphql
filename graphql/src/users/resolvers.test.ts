import { describe, vi, test, expect, afterEach } from 'vitest'
import { register, login } from './userService.js'

import { resolvers } from './resolvers.js'

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
    })

    expect(register).toHaveBeenCalledWith({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'correcthorsebatterystaple'
    })

    // expect(actual).toEqual({
    //     id: 1,
    //     name: 'testuser',
    //     email: 'testuser@example.com',
    //     password: 'hashedpassword'
    // })
})
import prisma from '../utils/prismaWrapper.js';
import jwt from 'jsonwebtoken';

import { register, login } from './userService.js';
import { describe, Mock, test, vi, expect, beforeEach } from 'vitest';

vi.mock('../utils/prismaWrapper.js', () => ({
    default: {
        user: {
            create: vi.fn(),
            findUnique: vi.fn()
        }
    }
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn()
    }
}))

describe('User service', () => {
    beforeEach(() => {
        (jwt.sign as Mock).mockReturnValue("verycooltoken");
    })

    test('register creates a new user', async () => {
        (prisma.user.create as Mock).mockResolvedValue({
            id: '1',
            name: 'testuser',
            email: 'testuser@example.com'
        });

        const actual = await register({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        expect(actual.user.name).toBe('testuser');
        expect(actual.token).toBe('verycooltoken');
        expect(prisma.user.create).toHaveBeenCalled();
    })

    test('register informs if user already exists', async () => {
        (prisma.user.findUnique as Mock).mockImplementation(({ where }) => {
            if (where.name === 'testuser') {
                return Promise.resolve({
                    id: '1',
                    name: 'testuser',
                    email: 'testuser@example.com'
                })
            }
            return Promise.resolve(null);
        })

        const call = register({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("User name already in use.")
    })

    test('register informs if email already exists', async () => {
        (prisma.user.findUnique as Mock).mockImplementation(({ where }) => {
            if (where.email === 'testuser@example.com') {
                return Promise.resolve({
                    id: '1',
                    name: 'testuser',
                    email: 'testuser@example.com'
                })
            }
            return Promise.resolve(null);
        })

        const call = register({
            email: 'testuser@example.com',
            username: 'testuser1',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("Email already in use.")
    })

    // test('login retrieves the user', async () => {
    //     (prisma.user.findUnique as Mock).mockImplementation(({ where }) => {
    //         if (where.name === 'testuser') {
    //             return Promise.resolve({
    //                 id: '1',
    //                 name: 'testuser',
    //                 email: 'testuser@example.com',
    //                 password: 'verycooltoken'
    //             })
    //         }
    //         return Promise.resolve(null);
    //     })

    //     const actual = await login({
    //         username: 'testuser',
    //         password: 'correcthorsebatterystaple'
    //     })

    //     expect(actual.user.name).toBe('testuser');
    //     expect(actual.token).toBe('verycooltoken');
    //     expect(prisma.user.create).toHaveBeenCalled();
    // })
})
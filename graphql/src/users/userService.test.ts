import jwt from 'jsonwebtoken';
import { encrypt } from '../utils/encryption.js';

import { UserService } from './userService.js';
import { describe, Mock, test, vi, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn()
    }
}))

vi.mock('../utils/encryption', () => ({
    encrypt: vi.fn()
}))

describe('User service', () => {
    const mockPrisma = {
        user: {
            create: vi.fn(),
            findUnique: vi.fn()
        }
    } as unknown as PrismaClient

    const userService = new UserService(mockPrisma)

    afterEach(() => vi.resetAllMocks());

    beforeEach(() => {
        (jwt.sign as Mock).mockReturnValue("verycooltoken");
        (encrypt as Mock).mockReturnValue('verycoolhash');
    })

    test('register creates a new user', async () => {
        vi.mocked(mockPrisma.user.create).mockResolvedValue({
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'verycoolhash'
        });

        const actual = await userService.register({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        expect(actual.user.name).toBe('testuser');
        expect(actual.token).toBe('verycooltoken');
        expect(mockPrisma.user.create).toHaveBeenCalled();
    })

    test('register informs if user already exists', async () => {
        (mockPrisma.user.findUnique as Mock).mockImplementation(({ where }) => {
            if (where.name === 'testuser') {
                return Promise.resolve({
                    id: '1',
                    name: 'testuser',
                    email: 'testuser@example.com'
                })
            }
            return Promise.resolve(null);
        })

        const call = userService.register({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("User name already in use.")
    })

    test('register informs if email already exists', async () => {
        (mockPrisma.user.findUnique as Mock).mockImplementation(({ where }) => {
            if (where.email === 'testuser@example.com') {
                return Promise.resolve({
                    id: '1',
                    name: 'testuser',
                    email: 'testuser@example.com'
                })
            }
            return Promise.resolve(null);
        })

        const call = userService.register({
            email: 'testuser@example.com',
            username: 'testuser1',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("Email already in use.")
    })

    test('login retrieves the user', async () => {
        (mockPrisma.user.findUnique as Mock).mockImplementation(({ where }) => {
            if (where.name === 'testuser') {
                return Promise.resolve({
                    id: '1',
                    name: 'testuser',
                    email: 'testuser@example.com',
                    password: 'verycoolhash'
                })
            }
            return Promise.resolve(null);
        });

        const actual = await userService.login({
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        expect(actual.user.name).toBe('testuser');
        expect(actual.token).toBe('verycooltoken');
        expect(mockPrisma.user.findUnique).toHaveBeenCalled();
    })

    test('login hashes the password', async () => {
        vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'verycoolhash'
        });

        await userService.login({
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        expect(encrypt).toHaveBeenCalledWith('correcthorsebatterystaple')
    })

    test('login fails if user name is not found', async () => {
        const call = userService.login({
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("User name or password incorrect.")
    })

    test('login fails if password is incorrect', async () => {
        vi.mocked(mockPrisma.user.findUnique).mockResolvedValue({
            id: 1,
            name: 'testuser',
            email: 'testuser@example.com',
            password: 'verycoolhash'
        });

        (encrypt as Mock).mockReturnValue('incorrecthash');
        
        const call = userService.login({
            username: 'testuser',
            password: 'correcthorsebatterystaple'
        })

        await expect(call).rejects.toThrow("User name or password incorrect.")
    })
})
import { PrismaClient } from "@prisma/client";
import { describe, vi, afterEach, test, expect } from "vitest";
import { CharService } from "./charService.js";

describe('Character service', () => {
    const mockPrisma = {
        user: {
            create: vi.fn(),
            findUnique: vi.fn()
        }
    } as unknown as PrismaClient

    const charService = new CharService(mockPrisma)

    afterEach(() => vi.resetAllMocks());

    test('get characters for user returns characters that belong only to user', async () => {
        
        //const actual = await charService.getCharactersFor('testuser')

        //expect(actual.)
    })
})
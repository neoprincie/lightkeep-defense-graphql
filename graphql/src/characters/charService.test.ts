import { PrismaClient, Character, Prisma } from "@prisma/client";
import { describe, vi, afterEach, test, expect, Mock } from "vitest";
import { CharService } from "./charService.js";
import { IUserContext } from "../utils/context.js";

describe('Character service', () => {
    const mockPrisma = {
        character: {
            findMany: vi.fn(),
            create: vi.fn()
        },
        characterClass: {
            findUnique: vi.fn()
        }
    } as unknown as PrismaClient

    const charService = new CharService(mockPrisma)

    afterEach(() => vi.resetAllMocks());

    test('get characters for user returns characters that belong only to user', async () => {
        vi.mocked(mockPrisma.character.findMany).mockResolvedValue(
            [
                {
                    id: 1,
                    name: "coolhero",
                    user: {
                        id: 1,
                        name: 'testuser'
                    }
                } as Prisma.CharacterGetPayload<{ include: { user: true } }>
            ]
        )

        const userContext: IUserContext = {
            id: 1,
            email: 'testuser@example.com'
        }

        const actual = await charService.getCharactersForCurrentUser(userContext)

        expect(actual[0].name).toBe("coolhero")
        expect(actual[0].user.name).toBe('testuser')

        expect(mockPrisma.character.findMany).toBeCalledWith({
            include: {
                user: true,
                class: true
            },
            where: {
                userId: 1
            }
        })
    })

    test('create character allows creation of new character for current user based on chosen class', async () => {
        vi.mocked(mockPrisma.characterClass.findUnique).mockResolvedValue({
            id: 1,
            name: 'Warrior',
            baseHp: 10,
            baseMp: 5,
            baseAttack: 6,
            baseDefense: 4
        })
        
        const userContext: IUserContext = {
            id: 1,
            email: 'testuser@example.com'
        }
        
        const actual = await charService.newCharacter({
            name: 'coolhero',
            userId: userContext.id,
            classId: 1
        })

        expect(mockPrisma.character.create).toBeCalledWith({
            data: {
                name: 'coolhero',
                userId: 1,
                classId: 1,
                level: 1,
                currentHp: 10,
                maxHp: 10,
                attack: 6,
                defense: 4,
                experience: 0
            } as Character
        })

        expect(mockPrisma.characterClass.findUnique).toBeCalledWith({
            where: {
                id: 1
            }
        })
    })
})
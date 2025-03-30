import { PrismaClient } from "@prisma/client";
import { Character } from '../generated/graphql.js'
import { IUserContext } from "../utils/context.js";

export interface ICharService {
    getCharactersForCurrentUser(userContext: IUserContext): Promise<Array<Character>>
    newCharacter({ name, userId, classId }: { name: string, userId: number, classId: number }): Promise<Character>
}

export class CharService implements ICharService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async getCharactersForCurrentUser(userContext: IUserContext): Promise<Array<Character>> {
        const characters = await this.prisma.character.findMany({
            include: {
                user: true,
                class: true
            },
            where: {
                userId: userContext.id
            }
        })

        return characters
    }

    async newCharacter({ name, userId, classId }: { name: string, userId: number, classId: number }): Promise<Character> {
        const charClass = await this.prisma.characterClass.findUnique({
            where: {
                id: classId
            }
        })

        const newChar = await this.prisma.character.create({
            data: {
                name: name,
                userId: userId,
                classId: classId,
                level: 1,
                currentHp: charClass.baseHp,
                maxHp: charClass.baseHp,
                attack: charClass.baseAttack,
                defense: charClass.baseDefense,
                experience: 0
            }
        })

        return newChar
    }
}
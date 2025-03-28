import { PrismaClient } from "@prisma/client";
import { Character } from '../generated/graphql.js'

interface ICharService {
    getCharactersFor(username: string): Array<Character>
}

export class CharService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }
}
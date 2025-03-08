import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        characters: (userId: number) => prisma.character.findMany({
            where: {
                userId: userId
            }
        })
    }
}
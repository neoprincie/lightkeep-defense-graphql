import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        characterClasses: () => prisma.characterClass.findMany()
    }
}
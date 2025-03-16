import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        characters: (_: any, __: any, context: any) => {
            if (!context.user) return null;

            return prisma.character.findMany({
                where: {
                    userId: context.user.id
                }
            })
        }
    }
}
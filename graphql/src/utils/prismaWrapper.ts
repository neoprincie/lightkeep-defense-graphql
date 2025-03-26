import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

export const resetPrismaClient = () => {
    prisma.$disconnect()
    prisma = new PrismaClient()
}

export default prisma;
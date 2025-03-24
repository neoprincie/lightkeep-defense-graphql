import { PrismaClient } from '@prisma/client';

console.log(process.env.DATABASE_URL)
let prisma = new PrismaClient();

export const resetPrismaClient = () => {
    console.log(process.env.DATABASE_URL)
    prisma.$disconnect()
    prisma = new PrismaClient()
}

export default prisma;
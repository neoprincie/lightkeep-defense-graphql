import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    await prisma.user.create({
        data: {
            name: "princie",
            email: "bryprinc@gmail.com"
        }
    });

    await prisma.characterClass.create({
        data: {
            name: "Warrior",
            baseHp: 15,
            baseMp: 3,
            baseAttack: 3,
            baseDefense: 3
        }
    })

    await prisma.characterClass.create({
        data: {
            name: "Wizard",
            baseHp: 5,
            baseMp: 9,
            baseAttack: 1,
            baseDefense: 1
        }
    })
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
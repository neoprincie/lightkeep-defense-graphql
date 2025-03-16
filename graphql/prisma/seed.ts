import { PrismaClient } from "@prisma/client";
import { createHash } from 'crypto'

const prisma = new PrismaClient();

async function seed() {
    let user = await prisma.user.create({
        data: {
            name: "princie",
            email: "bryprinc@gmail.com",
            password: createHash('sha256').update('supersecret').digest('hex')
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

    let charClass = await prisma.characterClass.create({
        data: {
            name: "Wizard",
            baseHp: 5,
            baseMp: 9,
            baseAttack: 1,
            baseDefense: 1
        }
    })

    await prisma.character.create({
        data: {
            name: "Napryn",
            userId: user.id,
            classId: charClass.id,
            level: 1,
            currentHp: charClass.baseHp,
            maxHp: charClass.baseHp,
            attack: charClass.baseAttack,
            defense: charClass.baseDefense,
            experience: 0
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
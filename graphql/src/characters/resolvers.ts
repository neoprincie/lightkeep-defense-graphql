import { PrismaClient } from "@prisma/client";
import { IContext, IUserContext } from "../utils/context";
import { Resolvers } from "../generated/graphql";

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
    Query: {
        characters: async (_: any, __: any, context: IContext) => {
            // if (!context.user) return null;

            // return prisma.character.findMany({
            //     include: {
            //         user: true,
            //         class: true
            //     },
            //     where: {
            //         userId: context.user.id
            //     }
            // })

            return await context
                .service
                .character
                .getCharactersForCurrentUser(context.user)
        }
    },
    Mutation: {
        newCharacter: async (_: any, { name, classId }: { name: string, classId: number }, context: IContext) => {
            return await context
                .service
                .character
                .newCharacter({
                    name: name, 
                    userId: context.user.id, 
                    classId: classId
                })
        }
    }
}
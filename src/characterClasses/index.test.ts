import { ApolloServer } from '@apollo/server';
import { expect, test } from 'vitest'

import { characterClasses } from './index.js'

test('says hello, world!', async () => {
    const typeDefs = `#graphql
        type Query
    `;

    const mockResolvers = {
        Query: {
            characterClasses: () => {
                return [{
                    name: "Warrior",
                    baseAttack: 1,
                    baseDefense: 2,
                    baseHp: 3,
                    baseMp: 4
                }]
            }
        }
    }

    const testServer = new ApolloServer({
        typeDefs: [typeDefs, characterClasses.typeDef],
        resolvers: mockResolvers
    });

    const response: any = await testServer.executeOperation({
        query: `#graphql 
            query GetCharacter { 
                characterClasses {
                    name
                    baseAttack
                    baseDefense
                    baseHp
                    baseMp
            }}`
    });

    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.characterClasses[0].name).toBe("Warrior");
    expect(response.body.singleResult.data.characterClasses[0].baseAttack).toBe(1);
    expect(response.body.singleResult.data.characterClasses[0].baseDefense).toBe(2);
    expect(response.body.singleResult.data.characterClasses[0].baseHp).toBe(3);
    expect(response.body.singleResult.data.characterClasses[0].baseMp).toBe(4);
})
import { ApolloServer } from '@apollo/server'
import { expect, test } from 'vitest'
import { characterClasses } from '../characterClasses/index.js'
import { users } from '../users/index.js'

import { typeDef } from './typeDef.js'

let testServer: ApolloServer

const createTestServer = (mockResolvers) => {
    return new ApolloServer({
        typeDefs: [`type Query`, typeDef, characterClasses.typeDef, users.typeDef],
        resolvers: mockResolvers
    })
}

test('characters query returns Characters', async () => {
    const mockResolvers = {
        Query: {
            characters: () => [
                {
                    id: 1,
                    name: "myCharacter",
                    user: { 
                        id: 1,
                        name: 'myself',
                        email: 'myself@example.com'
                    },
                    class: {
                        id: 1,
                        name: "myClass",
                        baseHp: 10,
                        baseMp: 5,
                        baseAttack: 3,
                        baseDefense: 3
                    },
                    level: 1,
                    currentHp: 10,
                    maxHp: 10,
                    attack: 3,
                    defense: 3,
                    experience: 0,
                }
            ]
        }
    }

    testServer = createTestServer(mockResolvers)

    const response: any = await testServer.executeOperation({
        query: `#graphql
            query GetCharacters {
                characters {
                    id
                    name
                    user {
                        id
                        name
                        email
                    }
                    class {
                        id
                        name
                        baseHp
                        baseMp
                        baseAttack
                        baseDefense
                    }
                    level
                    currentHp
                    maxHp
                    attack
                    defense
                    experience
                }
            }
        `
    })

    const characters = response.body.singleResult.data.characters
    const character = characters[0]

    expect(character.id).toBe(1)
    expect(character.name).toBe('myCharacter')

    expect(character.user.id).toBe(1)
    expect(character.user.name).toBe('myself')
    expect(character.user.email).toBe('myself@example.com')

    expect(character.class.id).toBe(1)
    expect(character.class.name).toBe('myClass')
    expect(character.class.baseHp).toBe(10)
    expect(character.class.baseMp).toBe(5)
    expect(character.class.baseAttack).toBe(3)
    expect(character.class.baseDefense).toBe(3)

    expect(character.level).toBe(1)
    expect(character.currentHp).toBe(10)
    expect(character.maxHp).toBe(10)
    expect(character.attack).toBe(3)
    expect(character.defense).toBe(3)
    expect(character.experience).toBe(0)
})
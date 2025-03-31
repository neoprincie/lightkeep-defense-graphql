import { request } from './graphqlWrapper.js'

export const getCharacters = async (userName, token) => {
    const query = `#graphql
        query {
            characters {
                name
                class {
                    name
                    baseHp
                }
                level
                user {
                    id
                    name
                    email
                }
                attack
                currentHp
                defense
                experience
                id
                maxHp
            }
        }
    `
    const req = await request(query, {}, token);
    
    return req.characters;
}

export const newCharacter = async (characterName, characterClass, userName, token) => {
    const query = `#graphql
        mutation($name: String!, $classId: Int!) {
            newCharacter(name: $name, classId: $classId) {
                name
                user {
                    email
                    id
                    name
                }
                attack
                class {
                    name
                    id
                    baseMp
                    baseHp
                    baseDefense
                    baseAttack
                }
                currentHp
                defense
                experience
                id
                level
                maxHp
            }
        }
    `
    
    const variables = {
        "name": characterName,
        "classId": 1
    }

    const req = await request(query, variables, token);
    
    return req.newCharacter;
}
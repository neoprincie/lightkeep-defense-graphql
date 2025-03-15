import { request } from './graphqlWrapper.js'

export const getCharacters = async (userName, token) => {
    const query = `#graphql
        query {
            characters {
                name,
                level
            }
        }
    `
    const req = await request(query);
    
    return req.characters;
}

export const newCharacter = async (characterName, characterClass, userName, token) => {

}
import { request } from './graphqlWrapper.js'

export const getCharacters = async (userName) => {
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
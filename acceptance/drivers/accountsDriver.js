import { request } from './graphqlWrapper.js'

export const registerUser = async (email, userName, password) => {
    const query = `#graphql
        mutation($email: String!, $username: String!, $password: String!) {
            register(email: $email, username: $username, password: $password) {
                token
                user {
                    name
                    id
                    email
                }
            }
        }
    `

    const variables = {
        "email": email,
        "username": userName,
        "password": password
    }

    const req = await request(query, variables);
    
    return req.register;
}
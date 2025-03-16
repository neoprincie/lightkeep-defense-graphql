export const typeDef = `#graphql
    type User {
        id: Int!
        name: String!
        email: String!
        token: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        login(username: String!, password: String!): AuthPayload
        register(email: String!, username: String!, password: String!): AuthPayload
    }

    extend type Query {
        me: User
    }
`;
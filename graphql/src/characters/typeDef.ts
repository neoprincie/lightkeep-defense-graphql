export const typeDef = `#graphql
    type Character {
        id: Int
        name: String
        user: User
        class: CharacterClass
        level: Int
        currentHp: Int
        maxHp: Int
        attack: Int
        defense: Int
        experience: Int
      }

    extend type Query {
        characters: [Character]
    }
`;
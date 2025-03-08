export const typeDef = `#graphql
    type CharacterClass {
        id: Int
        name: String
        baseHp: Int
        baseMp: Int
        baseAttack: Int
        baseDefense: Int
    }
    
    extend type Query {
        characterClasses: [CharacterClass]
    }`;
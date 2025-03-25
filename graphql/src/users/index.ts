import { resolvers } from './resolvers.js'
import { readFileSync } from 'fs'

const typeDef = readFileSync('./src/users/schema.graphql', { encoding: 'utf-8' })

export const users =  {
  resolvers,
  typeDef,
};
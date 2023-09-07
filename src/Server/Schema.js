import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

export const Schema = loadSchemaSync('./Schema.gql', { loaders: [new GraphQLFileLoader()] })
import { mergeResolvers } from '@graphql-tools/merge'
import GraphQLDateTime from 'graphql-type-datetime';
import { UserResolvers } from '../User/UserResolvers.js'

const ImportedResolvers = [ { DateTime: GraphQLDateTime }, UserResolvers]
export const Resolvers = mergeResolvers(ImportedResolvers)
import { GraphQLDateTime } from 'graphql-iso-date'
import mutations from './mutations'
import queries from './queries'


const resolvers = {
    DateTime: GraphQLDateTime, // allows for typedef to resolve external scalar
    Query: queries,
    Mutation: mutations
}

export default resolvers

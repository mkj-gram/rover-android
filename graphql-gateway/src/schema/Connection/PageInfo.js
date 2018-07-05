import {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

const PageInfo = new GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about pagination in a connection.',
    fields: () => ({
        hasNextPage: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'When paginating forwards, are there more items?'
        },
        hasPreviousPage: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'When paginating backwards, are there more items?'
        },
        startCursor: {
            type: GraphQLString,
            description: 'When paginating backwards, the cursor to continue.'
        },
        endCursor: {
            type: GraphQLString,
            description: 'When paginating forwards, the cursor to continue.'
        }
    })
})

export default PageInfo

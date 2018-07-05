import { GraphQLID, GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

const Node = new GraphQLInterfaceType({
    name: 'Node',
    description: 'An Object with an ID',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    }),
    resolveType: ({ id }) => id !== undefined
})

export default Node

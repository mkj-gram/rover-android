import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'

export default new GraphQLObjectType({
    name: 'Account',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

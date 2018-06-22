import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import account from './account'

export default new GraphQLObjectType({
    name: 'User',
    description: 'user name/email and account name',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        account
    })
})

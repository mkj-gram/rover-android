import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const ActionInfo = new GraphQLObjectType({
    name: 'ActionInfo',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        attributes: {
            type: GraphQLJSON
        }
    })
})

export default ActionInfo

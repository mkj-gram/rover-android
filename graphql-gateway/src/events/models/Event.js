import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const Event = new GraphQLInputObjectType({
    name: 'Event',
    fields: () => ({
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        },
        attributes: {
            type: GraphQLJSON
        }
    })
})

export default Event

import {
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'
import Context from './Context'

const Event = new GraphQLInputObjectType({
    name: 'Event',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        },
        context: {
            type: new GraphQLNonNull(Context)
        },
        attributes: {
            type: GraphQLJSON
        }
    })
})

export default Event

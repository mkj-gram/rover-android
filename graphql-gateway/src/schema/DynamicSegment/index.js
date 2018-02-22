import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import data from './data'
import predicates from './predicates'

const DynamicSegment = new GraphQLObjectType({
    name: 'DynamicSegment',
    description: 'Segment of total devices',
    fields: () => ({
        segmentId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({ segmentId }) => segmentId
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ name }) => name
        },
        data,
        predicates
    })
})

export default DynamicSegment

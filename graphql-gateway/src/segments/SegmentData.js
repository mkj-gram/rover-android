import {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const SegmentData = new GraphQLObjectType({
    name: 'SegmentData',
    description: 'Payload from a segment page',
    fields: () => ({
        dataGridRows: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLJSON))),
            resolve: data => data.dataGridRows
        },
        segmentSize: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data.segmentSize
        },
        totalSize: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data.totalSize
        }
    })
})

export default SegmentData
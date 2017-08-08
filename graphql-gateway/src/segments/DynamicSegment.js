import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import { getSegmentPageById } from './SegmentRowsQuery'

import PredicateAggregate from './PredicateAggregate'
import SegmentData from './SegmentData'

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
        data: {
            type: new GraphQLNonNull(SegmentData),
            resolve: ({ segmentId, pageNumber, pageSize }) => 
            {      
                return getSegmentPageById(segmentId, pageNumber, pageSize)
            }
        },
        predicates: {
            type: new GraphQLNonNull(PredicateAggregate),
            resolve: ({ predicates }) => predicates
        }
    })
})

export default DynamicSegment

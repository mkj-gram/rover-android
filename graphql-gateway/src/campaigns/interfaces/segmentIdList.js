import {
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'
import { segmentCondition } from '../types/definitions'

const segmentIdList = new GraphQLInterfaceType({
    name: 'SegmentIdList',
    description: 'List of Rover Segments to apply to Rover Campaign',
    fields: () => ({
        segmentIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
            description: 'List of segments'
        },
        segmentCondition: {
            type: segmentCondition,
            description: 'Include any or all segments'
        }
    })
})

export default segmentIdList

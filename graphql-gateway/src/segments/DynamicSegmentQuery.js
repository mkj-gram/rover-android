import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
import DynamicSegment from './DynamicSegment'
import { getSegmentPageById } from './SegmentRowsQuery'

import { getSegment } from './mockSegments'

const DynamicSegmentQuery = {
    type: new GraphQLList(DynamicSegment),
    args: {
        segmentId: {
            type: GraphQLID
        },
        pageNumber: {
            type: GraphQLInt
        },
        pageSize: {
            type: GraphQLInt
        }
    },
    resolve(_, { segmentId, pageNumber, pageSize }) {
        return getSegment(segmentId, pageNumber, pageSize)
    }
}

export default DynamicSegmentQuery

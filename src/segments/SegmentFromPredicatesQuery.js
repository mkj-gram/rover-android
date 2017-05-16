import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import SegmentData from './SegmentData'
import { getSegmentPageByPredicates } from './SegmentRowsQuery'

const SegmentFromPredicatesQuery = {
    type: SegmentData,
    args: {
        predicates: {
            type: new GraphQLNonNull(GraphQLString)
        },
        pageNumber: {
            type: GraphQLInt
        },
        pageSize: {
            type: GraphQLInt
        }
    },
    resolve(_, { predicates, pageNumber, pageSize}) {
        const parsedPredicates = JSON.parse(predicates.replace(/'/g, `"`))
        return getSegmentPageByPredicates(parsedPredicates, pageNumber, pageSize)
    }
}

export default SegmentFromPredicatesQuery

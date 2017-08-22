import { GraphQLInputObjectType, GraphQLString } from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const SegmentInputType = new GraphQLInputObjectType({
    name: 'SegmentInput',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        predicates: { type: GraphQLJSON },
        queryCondition: { type: GraphQLString }
    }
})

export default SegmentInputType

import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const SegmentRow = new GraphQLObjectType({
    name: 'SegmentRow',
    description: 'Segmentable mobile device',
    fields: () => ({
        profile: {
            type: new GraphQLNonNull(GraphQLJSON),
            resolve: segmentRow => segmentRow.profile
        },
        device: {
            type: new GraphQLNonNull(GraphQLJSON),
            resolve: segmentRow => segmentRow.device
        }
    })
})

export default Device

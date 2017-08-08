import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} from 'graphql'

import SchemaAttribute from './SchemaAttribute'

const SegmentSchema = new GraphQLObjectType({
    name: 'SegmentSchema',
    description: 'Schema of available predicate attributes',
    fields: () => ({
        deviceSchema: {
            type: new GraphQLNonNull(new GraphQLList(SchemaAttribute))
        },
        profileSchema: {
            type: new GraphQLNonNull(new GraphQLList(SchemaAttribute))
        }
    })
})

export default SegmentSchema

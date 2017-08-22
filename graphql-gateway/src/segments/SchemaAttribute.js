import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

const SchemaAttribute = new GraphQLObjectType({
    name: 'SchemaAttribute',
    description: 'Name and Type of attribute available in SegmentSchema',
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        label: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ attributeType }) => attributeType
        }
    })
})

export default SchemaAttribute

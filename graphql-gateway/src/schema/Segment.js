import {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

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
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString),
        }
    })
})

export const SegmentData = new GraphQLObjectType({
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

export const SegmentInputType = new GraphQLInputObjectType({
    name: 'SegmentInput',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        predicates: { type: GraphQLJSON },
        queryCondition: { type: GraphQLString }
    })
})

export const SegmentSchema = new GraphQLObjectType({
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

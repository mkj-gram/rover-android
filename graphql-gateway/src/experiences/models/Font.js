import {
    GraphQLFloat,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType
 } from 'graphql'

import FontWeight from './FontWeight'

const Font = new GraphQLObjectType({
    name: 'Font',
    fields: () => ({
        size: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['size']
        },
        weight: {
            type: new GraphQLNonNull(FontWeight),
            resolve: data => data['weight']
        }
    })
})

export default Font

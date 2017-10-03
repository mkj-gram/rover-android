import {
	GraphQLInt,
	GraphQLFloat,
	GraphQLNonNull,
	GraphQLObjectType
} from 'graphql'

const Color = new GraphQLObjectType({
    name: 'Color',
    fields: () => ({
        red: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['red']
        },
        green: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['green']
        },
        blue: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['blue']
        },
        alpha: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: data => data['alpha']
        }
    })
})

export default Color

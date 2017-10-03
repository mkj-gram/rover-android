import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'

const Insets = new GraphQLObjectType({
    name: 'Insets',
    fields: () => ({
        bottom: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['bottom']
		},
        left: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['left']
		},
        right: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['right']
		},
        top: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['top']
		}
    })
})

export default Insets

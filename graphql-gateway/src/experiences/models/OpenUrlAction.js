import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

const OpenUrlAction = new GraphQLObjectType({
    name: 'OpenUrlAction',
    fields: () => ({
		url: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['url']
		}
	})
})

export default OpenUrlAction

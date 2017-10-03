import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql'

const GoToScreenAction = new GraphQLObjectType({
    name: 'GoToScreenAction',
    fields: () => ({
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		}
	})
})

export default GoToScreenAction

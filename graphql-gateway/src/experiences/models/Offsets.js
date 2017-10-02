import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Length from './Length'

const Offsets = new GraphQLObjectType({
    name: 'Offsets',
    fields: () => ({
        bottom: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['bottom']
		},
        center: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['center']
		},
        left: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['left']
		},
        middle: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['middle']
		},
        right: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['right']
		},
        top: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['top']
		}
    })
})

export default Offsets

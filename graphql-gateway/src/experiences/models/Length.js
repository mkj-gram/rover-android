import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Unit from './Unit'

const Length = new GraphQLObjectType({
    name: 'Length',
    fields: () => ({
        unit: {
			type: new GraphQLNonNull(Unit),
			resolve: data => data['type']
		},
        value: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['value']
		}
    })
})

export default Length

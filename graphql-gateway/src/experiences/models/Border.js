import { GraphQLInt, GraphQLInterfaceType, GraphQLNonNull } from 'graphql'
import Color from './Color'

const Border = new GraphQLInterfaceType({
    name: 'Border',
    fields: () => ({
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
            return RectangleBlock
        }

        return ButtonState
    }
})

export default Border

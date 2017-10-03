import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Color from './Color'
import Font from './Font'
import TextAlignment from './TextAlignment'

const Text = new GraphQLInterfaceType({
    name: 'Text',
    fields: () => ({
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment)
        },
        textColor: {
            type: new GraphQLNonNull(Color)
        },
        textFont: {
            type: new GraphQLNonNull(Font)
        }
    }),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
            return TextBlock
        }

        return ButtonState
    }
})

export default Text

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
            if (data['barcode-scale']) {
                return BarcodeBlock
            }

            if (data['states']) {
                return ButtonBlock
            }

            if (data['image']) {
                return ImageBlock
            }

            if (data['text']) {
                return TextBlock
            }

            if (typeof data['scrollable'] !== 'undefined') {
                return WebViewBlock
            }

            return RectangleBlock
        }

        return ButtonState
    }
})

export default Border

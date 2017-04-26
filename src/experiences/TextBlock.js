import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import Block from './Block'
import Color from './Color'
import Font from './Font'
import RectangleBlock from './RectangleBlock'
import TextAlignment from './TextAlignment'
import TextMixin from './TextMixin'

class TextBlock extends TextMixin(RectangleBlock) { }

TextBlock.fromJSON = json => {
    const props = TextBlock.normalizeJSON(json)
    return new TextBlock(props)
}

TextBlock.type = new GraphQLObjectType({
    name: 'TextBlock',
    description: 'A text block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: TextBlock.fields,
    isTypeOf: data => data instanceof TextBlock
})

export default TextBlock

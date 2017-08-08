import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasText from './HasText'

class TextBlock extends HasText(HasBorder(HasBackground(Block(null)))) { }

TextBlock.fromJSON = json => {
    const props = TextBlock.normalizeJSON(json)
    return new TextBlock(props)
}

TextBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json),
        ...HasText.normalizeJSON(json)
    }
}

TextBlock.fields = {
    ...Block.fields,
    ...HasBackground.fields,
    ...HasBorder.fields,
    ...HasText.fields
}

TextBlock.type = new GraphQLObjectType({
    name: 'TextBlock',
    description: 'A text block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBorder.type, HasText.type],
    fields: TextBlock.fields,
    isTypeOf: data => data instanceof TextBlock
})

export default TextBlock

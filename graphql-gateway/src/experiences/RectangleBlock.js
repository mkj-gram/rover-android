import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'

class RectangleBlock extends HasBorder(HasBackground(Block(null))) { }

RectangleBlock.fromJSON = json => {
    const props = RectangleBlock.normalizeJSON(json)
    return new RectangleBlock(props)
}

RectangleBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json)
    }
}

RectangleBlock.fields = {
    ...Block.fields,
    ...HasBackground.fields,
    ...HasBorder.fields
}

RectangleBlock.type = new GraphQLObjectType({
    name: 'RectangleBlock',
    description: 'A rectangle block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBorder.type],
    fields: RectangleBlock.fields,
    isTypeOf: data => data instanceof RectangleBlock
})

export default RectangleBlock

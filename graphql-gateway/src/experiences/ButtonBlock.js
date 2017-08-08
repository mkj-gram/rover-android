import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasButtonStates from './HasButtonStates'

class ButtonBlock extends HasButtonStates(Block(null)) { }

ButtonBlock.fromJSON = json => {
    const props = ButtonBlock.normalizeJSON(json)
    return new ButtonBlock(props)
}

ButtonBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...HasButtonStates.normalizeJSON(json)
    }
}

ButtonBlock.fields = {
    ...Block.fields,
    ...HasButtonStates.fields
}

ButtonBlock.type = new GraphQLObjectType({
    name: 'ButtonBlock',
    description: 'A button block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasButtonStates.type],
    fields: ButtonBlock.fields,
    isTypeOf: data => data instanceof ButtonBlock
})

export default ButtonBlock

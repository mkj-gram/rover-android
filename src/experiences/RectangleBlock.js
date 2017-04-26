import { GraphQLObjectType } from 'graphql'

import Block from './Block'

class RectangleBlock extends Block { }

RectangleBlock.fromJSON = json => {
	const props = RectangleBlock.normalizeJSON(json)
	return new RectangleBlock(props)
}

RectangleBlock.normalizeJSON = json => {
	if (!json) {
        return {}
    }
    
    return {
    	...Block.normalizeJSON(json)
    }
}

RectangleBlock.fields = {
	...Block.fields
}

RectangleBlock.type = new GraphQLObjectType({
    name: 'RectangleBlock',
    description: 'A rectangle block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: RectangleBlock.fields,
    isTypeOf: data => data instanceof RectangleBlock
})

export default RectangleBlock

import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import Color from './Color'
import Image from './Image'
import Length from './Length'
import Offset from './Offset'

class RectangleBlock {

	constructor({ action,
				  autoHeight,
				  backgroundColor,
				  backgroundContentMode,
				  backgroundImage,
				  backgroundScale,
				  borderColor,
				  borderRadius,
				  borderWidth,
				  experienceId,
				  height,
				  id,
				  inset,
				  horizontalAlignment,
				  offset,
				  opacity,
				  position,
				  rowId,
				  screenId,
				  verticalAlignment,
				  width }) {

		this.action = action
		this.autoHeight = autoHeight
		this.backgroundColor = backgroundColor
		this.backgroundContentMode = backgroundContentMode
		this.backgroundImage = backgroundImage
		this.backgroundScale = backgroundScale
		this.borderColor = borderColor
		this.borderRadius = borderRadius
		this.borderWidth = borderWidth
		this.experienceId = experienceId
		this.height = height
		this.id = id
		this.inset = inset
		this.horizontalAlignment = horizontalAlignment
		this.offset = offset
		this.opacity = opacity
		this.position = position
		this.rowId = rowId
		this.screenId = screenId
		this.verticalAlignment = verticalAlignment
		this.width = width
	}
}

RectangleBlock.fromJSON = json => {
	const props = Block.normalizeJSON(json)
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

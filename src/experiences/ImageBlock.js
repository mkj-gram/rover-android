import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import Image from './Image'

class ImageBlock extends Block {

	constructor(props) {
		super(props)

		const { image } = props

    	this.image = image
	}
}

ImageBlock.fromJSON = json => {
    const props = ImageBlock.normalizeJSON(json)
    return new ImageBlock(props)
}

ImageBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        image: Image.fromJSON(json['image'])
    }
}

ImageBlock.fields = {
    ...Block.fields,
    image: { type: Image.type }
}

ImageBlock.type = new GraphQLObjectType({
    name: 'ImageBlock',
    description: 'An image block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: ImageBlock.fields,
    isTypeOf: data => data instanceof ImageBlock
})

export default ImageBlock

import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasImage from './HasImage'

class ImageBlock extends HasImage(Block(null)) { }

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
        ...HasImage.normalizeJSON(json)
    }
}

ImageBlock.fields = {
    ...Block.fields,
    ...HasImage.fields
}

ImageBlock.type = new GraphQLObjectType({
    name: 'ImageBlock',
    description: 'An image block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBorder.type, HasImage.type],
    fields: ImageBlock.fields,
    isTypeOf: data => data instanceof ImageBlock
})

export default ImageBlock

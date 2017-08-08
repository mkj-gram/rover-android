import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBarcode from './HasBarcode'
import HasBorder from './HasBorder'

class BarcodeBlock extends HasBorder(HasBarcode(HasBackground(Block(null)))) { }

BarcodeBlock.fromJSON = json => {
    const props = BarcodeBlock.normalizeJSON(json)
    return new BarcodeBlock(props)
}

BarcodeBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBarcode.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json)
    }
}

BarcodeBlock.fields = {
    ...Block.fields,
    ...HasBackground.fields,
    ...HasBarcode.fields,
    ...HasBorder.fields
}

BarcodeBlock.type = new GraphQLObjectType({
    name: 'BarcodeBlock',
    description: 'A barcode block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBarcode.type, HasBorder.type],
    fields: BarcodeBlock.fields,
    isTypeOf: data => data instanceof BarcodeBlock
})

export default BarcodeBlock

import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBarcode from './HasBarcode'
import HasBorder from './HasBorder'

class BarcodeBlock extends HasBarcode(Block(null)) { }

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
        ...HasBarcode.normalizeJSON(json)
    }
}

BarcodeBlock.fields = {
    ...Block.fields,
    ...HasBarcode.fields
}

BarcodeBlock.type = new GraphQLObjectType({
    name: 'BarcodeBlock',
    description: 'A barcode block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBarcode.type, HasBorder.type],
    fields: BarcodeBlock.fields,
    isTypeOf: data => data instanceof BarcodeBlock
})

export default BarcodeBlock

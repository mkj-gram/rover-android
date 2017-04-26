import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import Block from './Block'
import BarcodeFormat from './BarcodeFormat'

class BarcodeBlock extends Block {

	constructor(props) {
		super(props)

		const { barcodeScale,
    			barcodeText,
    			barcodeFormat } = props

    	this.barcodeScale = barcodeScale
    	this.barcodeText = barcodeText
    	this.barcodeFormat = barcodeFormat
	}
}

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
        barcodeScale: json['barcode-scale'],
        barcodeText: json['barcode-text'],
        barcodeFormat: json['barcode-type']
    }
}

BarcodeBlock.fields = {
    ...Block.fields,
    barcodeScale: { type: GraphQLString },
    barcodeText: { type: GraphQLString },
    barcodeFormat: { type: new GraphQLNonNull(BarcodeFormat.type) }
}

BarcodeBlock.type = new GraphQLObjectType({
    name: 'BarcodeBlock',
    description: 'A barcode block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: BarcodeBlock.fields,
    isTypeOf: data => data instanceof BarcodeBlock
})

export default BarcodeBlock

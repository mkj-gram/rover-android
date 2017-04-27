import { GraphQLInterfaceType, GraphQLNonNull, GraphQLString } from 'graphql'

import BarcodeFormat from './BarcodeFormat'

const HasBarcode = SuperClass => {

    class ChildClass extends SuperClass {

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

    return ChildClass
}

HasBarcode.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        barcodeScale: json['barcode-scale'],
        barcodeText: json['barcode-text'],
        barcodeFormat: json['barcode-type']
    }
}

HasBarcode.fields = {
    barcodeScale: { type: GraphQLString },
    barcodeText: { type: GraphQLString },
    barcodeFormat: { type: new GraphQLNonNull(BarcodeFormat.type) }
}

HasBarcode.type = new GraphQLInterfaceType({
    name: 'HasBarcode',
    fields: HasBarcode.fields
})

export default HasBarcode

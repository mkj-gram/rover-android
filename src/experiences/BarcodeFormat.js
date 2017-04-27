import { GraphQLEnumType } from 'graphql'

class BarcodeFormat { }

BarcodeFormat.type = new GraphQLEnumType({
    name: 'BarcodeFormat',
    values: {
        QR: { value: 'qrcode' },
        AZTEC: { value: 'azteccode' },
        PDF417: { value: 'hibcpdf417' },
        CODE128: { value: 'code128' }
    }
})

export default BarcodeFormat

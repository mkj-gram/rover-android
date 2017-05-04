import { GraphQLEnumType } from 'graphql'

class BarcodeFormat { }

BarcodeFormat.type = new GraphQLEnumType({
    name: 'BarcodeFormat',
    values: {
        QR_CODE: { value: 'qrcode' },
        AZTEC_CODE: { value: 'azteccode' },
        PDF417: { value: 'hibcpdf417' },
        CODE_128: { value: 'code128' }
    }
})

export default BarcodeFormat

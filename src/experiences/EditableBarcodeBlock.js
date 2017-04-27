import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBarcode from './HasBarcode'
import HasBorder from './HasBorder'

class EditableBarcodeBlock extends HasBarcode(EditableBlock(null)) { }

EditableBarcodeBlock.fromJSON = json => {
    const props = EditableBarcodeBlock.normalizeJSON(json)
    return new EditableBarcodeBlock(props)
}

EditableBarcodeBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...EditableBlock.normalizeJSON(json),
        ...HasBarcode.normalizeJSON(json)
    }
}

EditableBarcodeBlock.fields = {
    ...EditableBlock.fields,
    ...HasBarcode.fields
}

EditableBarcodeBlock.type = new GraphQLObjectType({
    name: 'EditableBarcodeBlock',
    description: 'A barcode block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBarcode.type, HasBorder.type],
    fields: EditableBarcodeBlock.fields,
    isTypeOf: data => data instanceof EditableBarcodeBlock
})

export default EditableBarcodeBlock

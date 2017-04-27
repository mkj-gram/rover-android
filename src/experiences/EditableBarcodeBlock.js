import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBarcode from './HasBarcode'
import HasBorder from './HasBorder'

class EditableBarcodeBlock extends HasBorder(HasBarcode(HasBackground(EditableBlock(Block(null))))) { }

EditableBarcodeBlock.fromJSON = json => {
    const props = EditableBarcodeBlock.normalizeJSON(json)
    return new EditableBarcodeBlock(props)
}

EditableBarcodeBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...EditableBlock.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBarcode.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json)
    }
}

EditableBarcodeBlock.fields = {
    ...Block.fields,
    ...EditableBlock.fields,
    ...HasBackground.fields,
    ...HasBarcode.fields,
    ...HasBorder.fields
}

EditableBarcodeBlock.type = new GraphQLObjectType({
    name: 'EditableBarcodeBlock',
    description: 'A barcode block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBarcode.type, HasBorder.type],
    fields: EditableBarcodeBlock.fields,
    isTypeOf: data => data instanceof EditableBarcodeBlock
})

export default EditableBarcodeBlock

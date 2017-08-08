import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasButtonStates from './HasButtonStates'

class EditableButtonBlock extends HasButtonStates(EditableBlock(Block(null))) { }

EditableButtonBlock.fromJSON = json => {
    const props = EditableButtonBlock.normalizeJSON(json)
    return new EditableButtonBlock(props)
}

EditableButtonBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...EditableBlock.normalizeJSON(json),
        ...HasButtonStates.normalizeJSON(json)
    }
}

EditableButtonBlock.fields = {
    ...Block.fields,
    ...EditableBlock.fields,
    ...HasButtonStates.fields
}

EditableButtonBlock.type = new GraphQLObjectType({
    name: 'EditableButtonBlock',
    description: 'A button block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasButtonStates.type],
    fields: EditableButtonBlock.fields,
    isTypeOf: data => data instanceof EditableButtonBlock
})

export default EditableButtonBlock

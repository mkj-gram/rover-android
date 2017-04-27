import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'

class EditableRectangleBlock extends HasBorder(HasBackground(EditableBlock(Block(null)))) { }

EditableRectangleBlock.fromJSON = json => {
    const props = EditableRectangleBlock.normalizeJSON(json)
    return new EditableRectangleBlock(props)
}

EditableRectangleBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...EditableBlock.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json)
    }
}

EditableRectangleBlock.fields = {
    ...Block.fields,
    ...EditableBlock.fields,
    ...HasBackground.fields,
    ...HasBorder.fields
}

EditableRectangleBlock.type = new GraphQLObjectType({
    name: 'EditableRectangleBlock',
    description: 'A rectangle block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBorder.type],
    fields: EditableRectangleBlock.fields,
    isTypeOf: data => data instanceof EditableRectangleBlock
})

export default EditableRectangleBlock

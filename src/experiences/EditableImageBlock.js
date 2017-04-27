import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasImage from './HasImage'

class EditableImageBlock extends HasImage(HasBorder(HasBackground(EditableBlock(Block(null))))) { }

EditableImageBlock.fromJSON = json => {
    const props = EditableImageBlock.normalizeJSON(json)
    return new EditableImageBlock(props)
}

EditableImageBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...EditableBlock.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json),
        ...HasImage.normalizeJSON(json)
    }
}

EditableImageBlock.fields = {
    ...Block.fields,
    ...EditableBlock.fields,
    ...HasBackground.fields,
    ...HasBorder.fields,
    ...HasImage.fields
}

EditableImageBlock.type = new GraphQLObjectType({
    name: 'EditableImageBlock',
    description: 'An image block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBorder.type, HasImage.type],
    fields: EditableImageBlock.fields,
    isTypeOf: data => data instanceof EditableImageBlock
})

export default EditableImageBlock

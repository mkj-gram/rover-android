import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasText from './HasText'

class EditableTextBlock extends HasText(EditableBlock(null)) { }

EditableTextBlock.fromJSON = json => {
    const props = EditableTextBlock.normalizeJSON(json)
    return new EditableTextBlock(props)
}

EditableTextBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...EditableBlock.normalizeJSON(json),
        ...HasText.normalizeJSON(json)
    }
}

EditableTextBlock.fields = {
    ...EditableBlock.fields,
    ...HasText.fields
}

EditableTextBlock.type = new GraphQLObjectType({
    name: 'EditableTextBlock',
    description: 'A text block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBorder.type, HasText.type],
    fields: EditableTextBlock.fields,
    isTypeOf: data => data instanceof EditableTextBlock
})

export default EditableTextBlock

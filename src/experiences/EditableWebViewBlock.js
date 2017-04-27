import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import EditableBlock from './EditableBlock'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasWebView from './HasWebView'

class EditableWebViewBlock extends HasWebView(EditableBlock(null)) { }

EditableWebViewBlock.fromJSON = json => {
    const props = EditableWebViewBlock.normalizeJSON(json)
    return new EditableWebViewBlock(props)
}

EditableWebViewBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...EditableBlock.normalizeJSON(json),
        ...HasWebView.normalizeJSON(json)
    }
}

EditableWebViewBlock.fields = {
    ...EditableBlock.fields,
    ...HasWebView.fields
}

EditableWebViewBlock.type = new GraphQLObjectType({
    name: 'EditableWebViewBlock',
    description: 'A web view block that includes fields related to authoring/editing',
    interfaces: [Block.type, EditableBlock.type, HasBackground.type, HasBorder.type, HasWebView.type],
    fields: EditableWebViewBlock.fields,
    isTypeOf: data => data instanceof EditableWebViewBlock
})

export default EditableWebViewBlock

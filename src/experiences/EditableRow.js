import { 
	GraphQLBoolean, 
	GraphQLList, 
	GraphQLNonNull, 
	GraphQLObjectType, 
	GraphQLString } from 'graphql'

import EditableBarcodeBlock from './EditableBarcodeBlock'
import EditableButtonBlock from './EditableButtonBlock'
import EditableBlock from './EditableBlock'
import EditableImageBlock from './EditableImageBlock'
import EditableRectangleBlock from './EditableRectangleBlock'
import EditableTextBlock from './EditableTextBlock'
import EditableWebViewBlock from './EditableWebViewBlock'
import Row from './Row'

class EditableRow extends Row {

	constructor(props) {        
        super(props)

        const { blocks,
                isCollapsed,
                name } = props

        this.blocks = blocks
        this.isCollapsed = isCollapsed
        this.name = name
    }
}

EditableRow.blockFromJSON = json => {
    if (!json) {
        return null
    }

    switch (json['type']) {
    case 'barcode-block':
        return EditableBarcodeBlock.fromJSON(json)
    case 'button-block':
        return EditableButtonBlock.fromJSON(json)
    case 'image-block':
        return EditableImageBlock.fromJSON(json)
    case 'text-block':
        return EditableTextBlock.fromJSON(json)
    case 'web-view-block':
        return EditableWebViewBlock.fromJSON(json)
    default:
        return EditableRectangleBlock.fromJSON(json)
    }
}

EditableRow.fromJSON = json => {
    const props = EditableRow.normalizeJSON(json)
    return new EditableRow(props)
}

EditableRow.normalizeJSON = json => {
    if (!json) {
        return {}
    }

    return {
        ...Row.normalizeJSON(json),
        blocks: (json['blocks'] || []).map(EditableRow.blockFromJSON),
        isCollapsed: json['is-collapsed'],
        name: json['name']
    }
}

EditableRow.fields = {
	...Row.fields,
	blocks: { type: new GraphQLNonNull(new GraphQLList(EditableBlock.type)) },
    isCollapsed: { type: new GraphQLNonNull(GraphQLBoolean) },
    name: { type: new GraphQLNonNull(GraphQLString) }
}

EditableRow.type = new GraphQLObjectType({
    name: 'EditableRow',
    description: 'A row that includes fields related to authoring/editing',
    fields: EditableRow.fields
})

export default EditableRow

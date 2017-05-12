import { GraphQLBoolean, 
		 GraphQLID, 
		 GraphQLList, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

import BarcodeBlock from './BarcodeBlock'
import Block from './Block'
import ButtonBlock from './ButtonBlock'
import HasBackground from './HasBackground'
import ImageBlock from './ImageBlock'
import Length from './Length'
import RectangleBlock from './RectangleBlock'
import TextBlock from './TextBlock'
import WebViewBlock from './WebViewBlock'

class Row extends HasBackground(null) {

	constructor(props) {
        super(props)

        const { autoHeight,
                blocks,
                experienceId,
                height,
                id,
                screenId } = props

		this.autoHeight = autoHeight
	    this.blocks = blocks
	    this.experienceId = experienceId
	    this.height = height
	    this.id = id
	    this.screenId = screenId
	}
}

Row.blockFromJSON = json => {
    if (!json) {
        return null
    }

    switch (json['type']) {
    case 'barcode-block':
        return BarcodeBlock.fromJSON(json)
    case 'button-block':
        return ButtonBlock.fromJSON(json)
    case 'image-block':
        return ImageBlock.fromJSON(json)
    case 'text-block':
        return TextBlock.fromJSON(json)
    case 'web-view-block':
        return WebViewBlock.fromJSON(json)
    default:
        return RectangleBlock.fromJSON(json)
    }
}

Row.fromJSON = json => {
	const props = Row.normalizeJSON(json)
	return new Row(props)
}

Row.normalizeJSON = json => {
    if (!json) {
        return {}
    }
	
    return {
        ...HasBackground.normalizeJSON(json),
        autoHeight: json['auto-height'],
        blocks: (json['blocks'] || []).map(Row.blockFromJSON),
        experienceId: json['experience-id'],
        height: Length.fromJSON(json['height']),
        id: json['id'],
        screenId: json['screen-id']
    }
}

Row.fields = {
    ...HasBackground.fields,
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    blocks: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Block.type))) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(Length.type) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) }
}

Row.type = new GraphQLObjectType({
    name: 'Row',
    description: 'A row that contains only the publicly accessible fields',
    interfaces: [HasBackground.type],
    fields: Row.fields,
    isTypeOf: data => data instanceof Row
})

export default Row

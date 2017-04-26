import { GraphQLBoolean, 
		 GraphQLID, 
		 GraphQLList, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

import BackgroundMixin from './BackgroundMixin'
import BarcodeBlock from './BarcodeBlock'
import Block from './Block'
import ImageBlock from './ImageBlock'
import Length from './Length'
import RectangleBlock from './RectangleBlock'
import TextBlock from './TextBlock'
import WebViewBlock from './WebViewBlock'

let Row = class {

	constructor({ autoHeight,
				  blocks,
				  experienceId,
				  height,
				  id,
				  screenId }) {

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
        autoHeight: json['auto-height'],
        blocks: (json['blocks'] || []).map(Row.blockFromJSON),
        experienceId: json['experience-id'],
        height: Length.fromJSON(json['height']),
        id: json['id'],
        screenId: json['screen-id']
    }
}

Row.fields = {
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    blocks: { type: new GraphQLNonNull(new GraphQLList(Block.type)) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(Length.type) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) }
}

Row = class extends BackgroundMixin(Row) { }

Row.type = new GraphQLObjectType({
    name: 'Row',
    description: 'A row that contains only the publicly accessible fields',
    fields: Row.fields
})

export default Row

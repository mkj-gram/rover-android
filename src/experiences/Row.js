import { GraphQLBoolean, 
		 GraphQLID, 
		 GraphQLList, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import BarcodeBlock from './BarcodeBlock'
import Block from './Block'
import Color from './Color'
import Image from './Image'
import ImageBlock from './ImageBlock'
import Length from './Length'
import RectangleBlock from './RectangleBlock'
import TextBlock from './TextBlock'
import WebViewBlock from './WebViewBlock'

class Row {

	constructor({ autoHeight,
				  backgroundColor,
				  backgroundImage,
				  backgroundContentMode,
				  backgroundScale,
				  blocks,
				  experienceId,
				  height,
				  id,
				  screenId }) {

		this.autoHeight = autoHeight
	    this.backgroundColor = backgroundColor
	    this.backgroundImage = backgroundImage
	    this.backgroundContentMode = backgroundContentMode
	    this.backgroundScale = backgroundScale
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
        backgroundColor: Color.fromJSON(json['background-color']),
        backgroundImage: Image.fromJSON(json['background-image']),
        backgroundContentMode: json['background-content-mode'],
        backgroundScale: json['background-scale'],
        blocks: (json['blocks'] || []).map(Row.blockFromJSON),
        experienceId: json['experience-id'],
        height: Length.fromJSON(json['height']),
        id: json['id'],
        screenId: json['screen-id']
    }
}

Row.fields = {
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(Color.type) },
    backgroundImage: { type: Image.type },
    backgroundContentMode: { type: BackgroundContentMode.type },
    backgroundScale: { type: BackgroundScale.type },
    blocks: { type: new GraphQLNonNull(new GraphQLList(Block.type)) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(Length.type) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) }
}

Row.type = new GraphQLObjectType({
    name: 'Row',
    description: 'A row that contains only the publicly accessible fields',
    fields: Row.fields
})

export default Row

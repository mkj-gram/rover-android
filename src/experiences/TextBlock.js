import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import Block from './Block'
import Color from './Color'
import Font from './Font'
import RectangleBlock from './RectangleBlock'
import TextAlignment from './TextAlignment'

class TextBlock extends RectangleBlock {

	constructor(props) {
		super(props)

		const { text,
                textAlignment,
                textColor,
                textFont } = props

    	this.text = text
        this.textAlignment = textAlignment
        this.textColor = textColor
        this.textFont = textFont
	}
}

TextBlock.fromJSON = json => {
    const props = TextBlock.normalizeJSON(json)
    return new TextBlock(props)
}

TextBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...RectangleBlock.normalizeJSON(json),
        text: json['text'],
        textAlignment: json['text-alignment'],
        textColor: json['text-color'],
        textFont: Font.fromJSON(json['text-font'])
    }
}

TextBlock.fields = {
    ...RectangleBlock.fields,
    text: { type: GraphQLString },
    textAlignment: { type: new GraphQLNonNull(TextAlignment.type) },
    textColor: { type: new GraphQLNonNull(Color.type) },
    textFont: { type: new GraphQLNonNull(Font.type)}
}

TextBlock.type = new GraphQLObjectType({
    name: 'TextBlock',
    description: 'A text block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: TextBlock.fields,
    isTypeOf: data => data instanceof TextBlock
})

export default TextBlock

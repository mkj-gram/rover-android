import { GraphQLInterfaceType, GraphQLNonNull, GraphQLString } from 'graphql'

import Color from './Color'
import Font from './Font'
import TextAlignment from './TextAlignment'

const HasText = SuperClass => {

	class ChildClass extends SuperClass {

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

	return ChildClass
}

HasText.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        text: json['text'],
        textAlignment: json['text-alignment'],
        textColor: json['text-color'],
        textFont: Font.fromJSON(json['text-font'])
    }
}

HasText.fields = {
    text: { type: new GraphQLNonNull(GraphQLString) },
    textAlignment: { type: new GraphQLNonNull(TextAlignment.type) },
    textColor: { type: new GraphQLNonNull(Color.type) },
    textFont: { type: new GraphQLNonNull(Font.type)}
}

HasText.type = new GraphQLInterfaceType({
    name: 'HasText',
    fields: HasText.fields
})

export default HasText

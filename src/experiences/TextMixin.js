import { GraphQLNonNull, GraphQLString } from 'graphql'

import Color from './Color'
import Font from './Font'
import TextAlignment from './TextAlignment'

const TextMixin = SuperClass => {

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

	ChildClass.normalizeJSON = json => {
	    if (!json) {
	        return {}
	    }
	    
	    return {
	    	...SuperClass.normalizeJSON(json),
	        text: json['text'],
	        textAlignment: json['text-alignment'],
	        textColor: json['text-color'],
	        textFont: Font.fromJSON(json['text-font'])
	    }
	}

	ChildClass.fields = {
		...SuperClass.fields,
	    text: { type: GraphQLString },
	    textAlignment: { type: new GraphQLNonNull(TextAlignment.type) },
	    textColor: { type: new GraphQLNonNull(Color.type) },
	    textFont: { type: new GraphQLNonNull(Font.type)}
	}

	return ChildClass
}

export default TextMixin

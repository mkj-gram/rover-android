import { GraphQLInt, GraphQLNonNull } from 'graphql'

import Color from './Color'

const BorderMixin = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { borderColor,
				  	borderRadius,
				  	borderWidth } = props

	    	this.borderColor = borderColor
			this.borderRadius = borderRadius
			this.borderWidth = borderWidth
		}
	}

	ChildClass.normalizeJSON = json => {
	    if (!json) {
	        return {}
	    }
	    
	    return {
	    	...SuperClass.normalizeJSON(json),
	        borderColor: Color.fromJSON(json['border-color']),
	        borderRadius: json['border-radius'] || 0,
	        borderWidth: json['border-width'] || 0
	    }
	}

	ChildClass.fields = {
		...SuperClass.fields,
	    borderColor: { type: new GraphQLNonNull(Color.type) },
    	borderRadius: { type: new GraphQLNonNull(GraphQLInt) },
    	borderWidth: { type: new GraphQLNonNull(GraphQLInt) }
	}

	return ChildClass
}

export default BorderMixin

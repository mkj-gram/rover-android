import { GraphQLInt, GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import Color from './Color'

const HasBorder = SuperClass => {

	class ChildClass extends SuperClass {

		constructor(props) {
			super(props)

			const { borderColor,
				  	borderRadius = 0,
				  	borderWidth = 0 } = props

	    	this.borderColor = borderColor
			this.borderRadius = borderRadius
			this.borderWidth = borderWidth
		}
	}

	return ChildClass
}

HasBorder.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        borderColor: Color.fromJSON(json['border-color']),
        borderRadius: json['border-radius'],
        borderWidth: json['border-width']
    }
}

HasBorder.fields = {
    borderColor: { type: new GraphQLNonNull(Color.type) },
	borderRadius: { type: new GraphQLNonNull(GraphQLInt) },
	borderWidth: { type: new GraphQLNonNull(GraphQLInt) }
}

HasBorder.type = new GraphQLInterfaceType({
    name: 'HasBorder',
    fields: HasBorder.fields
})

export default HasBorder

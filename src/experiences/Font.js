import { GraphQLFloat, 
		 GraphQLInt, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

import FontWeight from './FontWeight'

class Font {

	constructor(props) {
		const { size,
				weight } = props

		this.size = size
        this.weight = weight
	}
}

Font.fromJSON = json => {
	const props = Font.normalizeJSON(json)
	return new Font(props)
}

Font.normalizeJSON = json => {
	if (!json) {
		return {}
	}

	return {
		size: json['size'],
		weight: json['weight']
	}
}

Font.type = new GraphQLObjectType({
    name: 'Font',
    fields: {
        size: { type: new GraphQLNonNull(GraphQLInt) },
        weight: { type: new GraphQLNonNull(FontWeight.type) }
    }
})

export default Font

import { GraphQLFloat, 
		 GraphQLInt, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

class Insets {

	constructor(props) {

		const { bottom,
				left,
				right,
				top } = props

		this.bottom = bottom
        this.left = left
        this.right = right
        this.top = top
	}
}

Insets.fromJSON = json => {
	const props = Insets.normalizeJSON(json)
	return new Insets(props)
}

Insets.normalizeJSON = json => {
	if (!json) {
		return {}
	}

	return {
		bottom: json['bottom'],
        left: json['left'],
        right: json['right'],
        top: json['top']
	}
}

Insets.type = new GraphQLObjectType({
    name: 'Insets',
    fields: {
        bottom: { type: new GraphQLNonNull(GraphQLInt) },
        left: { type: new GraphQLNonNull(GraphQLInt) },
        right: { type: new GraphQLNonNull(GraphQLInt) },
        top: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

export default Insets

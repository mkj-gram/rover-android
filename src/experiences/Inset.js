import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'

class Inset {

	constructor({ bottom,
				  left,
				  right,
				  top }) { 

		this.bottom = bottom
        this.left = left
        this.right = right
        this.top = top
	}
}

Inset.fromJSON = json => {
	const props = Inset.normalizeJSON(json)
	return new Inset(props)
}

Inset.normalizeJSON = json => {
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

Inset.type = new GraphQLObjectType({
    name: 'Inset',
    fields: {
        bottom: { type: new GraphQLNonNull(GraphQLInt) },
        left: { type: new GraphQLNonNull(GraphQLInt) },
        right: { type: new GraphQLNonNull(GraphQLInt) },
        top: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

export default Inset

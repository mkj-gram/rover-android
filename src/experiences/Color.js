import { GraphQLFloat, 
		 GraphQLInt, 
		 GraphQLNonNull, 
		 GraphQLObjectType } from 'graphql'

class Color {

	constructor(props) {
		const { red = 255,
				green = 255,
				blue = 255,
				alpha = 255 } = props

		this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
	}
}

Color.fromJSON = json => {
	const props = Color.normalizeJSON(json)
	return new Color(props)
}

Color.normalizeJSON = json => {
	if (!json) {
		return {}
	}

	return {
		red: json['red'],
		green: json['green'],
		blue: json['blue'],
		alpha: json['alpha']
	}
}

Color.type = new GraphQLObjectType({
    name: 'Color',
    fields: {
        red: { type: new GraphQLNonNull(GraphQLInt) },
        green: { type: new GraphQLNonNull(GraphQLInt) },
        blue: { type: new GraphQLNonNull(GraphQLInt) },
        alpha: { type: new GraphQLNonNull(GraphQLFloat) }
    }
})

export default Color

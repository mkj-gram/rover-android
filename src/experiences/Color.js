import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'

class Color {

	constructor({ red,
				  green,
				  blue,
				  alpha }) {

		this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
	}
}

Color.fromJSON = json => {
	if (!json) {
		return null
	}

	return new Color({
		red: json['red'],
		green: json['green'],
		blue: json['blue'],
		alpha: json['alpha']
	})
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

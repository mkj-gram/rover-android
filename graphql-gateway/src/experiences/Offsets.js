import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Length from './Length'

class Offsets {

	constructor(props) {

        const { bottom,
                center,
                left,
                middle,
                right,
                top } = props

		this.bottom = bottom
		this.center = center
		this.left = left
		this.middle = middle
		this.right = right
		this.top = top
	}
}

Offsets.fromJSON = json => {
    if (!json) {
        return null
    }

    return new Offsets({
        bottom: Length.fromJSON(json['bottom']),
        center: Length.fromJSON(json['center']),
        left: Length.fromJSON(json['left']),
        middle: Length.fromJSON(json['middle']),
        right: Length.fromJSON(json['right']),
        top: Length.fromJSON(json['top'])
    })
}

Offsets.type = new GraphQLObjectType({
    name: 'Offsets',
    fields: {
        bottom: { type: new GraphQLNonNull(Length.type) },
        center: { type: new GraphQLNonNull(Length.type) },
        left: { type: new GraphQLNonNull(Length.type) },
        middle: { type: new GraphQLNonNull(Length.type) },
        right: { type: new GraphQLNonNull(Length.type) },
        top: { type: new GraphQLNonNull(Length.type) }
    }
})

export default Offsets

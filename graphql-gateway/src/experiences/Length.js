import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Unit from './Unit'

class Length {

	constructor(props) {

        const { unit, 
                value } = props
                
		this.unit = unit
		this.value = value
	}
}

Length.fromJSON = json => {
    if (!json) {
        return null
    }

    return new Length({
        unit: json['type'],
        value: json['value']
    })
}

Length.type = new GraphQLObjectType({
    name: 'Length',
    fields: {
        unit: { type: new GraphQLNonNull(Unit.type) },
        value: { type: new GraphQLNonNull(GraphQLFloat) }
    }
})

export default Length

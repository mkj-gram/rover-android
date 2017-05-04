import { GraphQLEnumType } from 'graphql'

class VerticalAlignment { }

VerticalAlignment.type = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        MIDDLE: { value: 'middle' },
        FILL: { value: 'fill' },
    }
})

export default VerticalAlignment

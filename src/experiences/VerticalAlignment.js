import { GraphQLEnumType } from 'graphql'

class VerticalAlignment { }

VerticalAlignment.type = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        CENTER: { value: 'middle' },
        FILL: { value: 'justify' },
    }
})

export default VerticalAlignment

import { GraphQLEnumType } from 'graphql'

class HorizontalAlignment { }

HorizontalAlignment.type = new GraphQLEnumType({
    name: 'HorizontalAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' },
        FILL: { value: 'fill' },
    }
})

export default HorizontalAlignment

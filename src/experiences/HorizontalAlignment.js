import { GraphQLEnumType } from 'graphql'

class HorizontalAlignment { }

HorizontalAlignment.type = new GraphQLEnumType({
    name: 'HorizontalAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' },
        JUSTIFY: { value: 'fill' },
    }
})

export default HorizontalAlignment

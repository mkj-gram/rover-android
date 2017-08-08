import { GraphQLEnumType } from 'graphql'

class TextAlignment { }

TextAlignment.type = new GraphQLEnumType({
    name: 'TextAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' }
    }
})

export default TextAlignment

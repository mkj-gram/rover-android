import { GraphQLEnumType } from 'graphql'

const TextAlignment = new GraphQLEnumType({
    name: 'TextAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' }
    }
})

export default TextAlignment

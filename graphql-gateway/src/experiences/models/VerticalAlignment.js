import { GraphQLEnumType } from 'graphql'

const VerticalAlignment = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        MIDDLE: { value: 'middle' },
        FILL: { value: 'fill' },
    }
})

export default VerticalAlignment

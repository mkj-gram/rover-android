import { GraphQLEnumType } from 'graphql'

const BackgroundContentMode = new GraphQLEnumType({
    name: 'BackgroundContentMode',
    values: {
        ORIGINAL: { value: 'original' },
        STRETCH: { value: 'stretch' },
        TILE: { value: 'tile' },
        FILL: { value: 'fill' },
        FIT: { value: 'fit' }
    }
})

export default BackgroundContentMode

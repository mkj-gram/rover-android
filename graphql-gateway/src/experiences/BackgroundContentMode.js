import { GraphQLEnumType } from 'graphql'

class BackgroundContentMode { }

BackgroundContentMode.type = new GraphQLEnumType({
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

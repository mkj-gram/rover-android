import { GraphQLEnumType } from 'graphql'

const TitleBarButtons = new GraphQLEnumType({
    name: 'TitleBarButtons',
    values: {
        CLOSE: { value: 'close' },
        BACK: { value: 'back' },
        BOTH: { value: 'both' }
    }
})

export default TitleBarButtons

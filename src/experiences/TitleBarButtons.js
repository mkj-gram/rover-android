import { GraphQLEnumType } from 'graphql'

class TitleBarButtons { }

TitleBarButtons.type = new GraphQLEnumType({
    name: 'TitleBarButtons',
    values: {
        CLOSE: { value: 'close' },
        BACK: { value: 'back' },
        BOTH: { value: 'both' }
    }
})

export default TitleBarButtons

import { GraphQLEnumType } from 'graphql'

class BlockAction { }

BlockAction.type = new GraphQLEnumType({
    name: 'BlockAction',
    values: {
        GO_TO_SCREEN: { value: 'go-to-screen' },
        OPEN_URL: { value: 'open-url' }
    }
})

export default BlockAction

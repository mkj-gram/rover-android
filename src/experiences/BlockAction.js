import { GraphQLUnionType, GraphQLString } from 'graphql'

import GoToScreenAction from './GoToScreenAction'
import OpenUrlAction from './OpenUrlAction'

class BlockAction { }

BlockAction.type = new GraphQLUnionType({
    name: 'BlockAction',
    types: [GoToScreenAction.type, OpenUrlAction.type]
})

export default BlockAction

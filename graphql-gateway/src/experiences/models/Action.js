import { GraphQLUnionType } from 'graphql'
import GoToScreenAction from './GoToScreenAction'
import OpenUrlAction from './OpenUrlAction'

const Action = new GraphQLUnionType({
    name: 'Action',
    types: () => [GoToScreenAction, OpenUrlAction],
    resolveType: data => {
        if (data['url']) {
            return OpenUrlAction
        }

        return GoToScreenAction
    }
})

export default Action

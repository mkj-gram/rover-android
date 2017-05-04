import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import BlockAction from './BlockAction'

class GoToScreenAction { 

    constructor(props) {
        const { experienceId,
                screenId } = props

        this.experienceId = experienceId
        this.screenId = screenId
    }
}

GoToScreenAction.fromJSON = json => {
    const props = GoToScreenAction.normalizeJSON(json)
    return new GoToScreenAction(props)
}

GoToScreenAction.normalizeJSON = json => {
    if (!json) {
        return {}
    }

    return {
        experienceId: json['experience-id'],
        screenId: json['screen-id']
    }
}

GoToScreenAction.fields = {
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) }
}

GoToScreenAction.type = new GraphQLObjectType({
    name: 'GoToScreenAction',
    description: 'A button action that navigates to a new screen',
    fields: GoToScreenAction.fields,
    isTypeOf: data => data instanceof GoToScreenAction
})

export default GoToScreenAction

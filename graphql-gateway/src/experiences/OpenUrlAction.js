import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import BlockAction from './BlockAction'

class OpenUrlAction { 

    constructor(props) {
        this.url = props.url
    }
}

OpenUrlAction.fromJSON = json => {
    const props = OpenUrlAction.normalizeJSON(json)
    return new OpenUrlAction(props)
}

OpenUrlAction.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        url: json['url']
    }
}

OpenUrlAction.fields = {
    url: { type: new GraphQLNonNull(GraphQLString) }
}

OpenUrlAction.type = new GraphQLObjectType({
    name: 'OpenUrlAction',
    description: 'A button action that opens a URL in a web browser',
    fields: OpenUrlAction.fields,
    isTypeOf: data => data instanceof OpenUrlAction
})

export default OpenUrlAction

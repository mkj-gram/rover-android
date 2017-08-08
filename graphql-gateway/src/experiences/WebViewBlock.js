import { GraphQLObjectType } from 'graphql'

import Block from './Block'
import HasBackground from './HasBackground'
import HasBorder from './HasBorder'
import HasWebView from './HasWebView'

class WebViewBlock extends HasWebView(HasBorder(HasBackground(Block(null)))) { }

WebViewBlock.fromJSON = json => {
    const props = WebViewBlock.normalizeJSON(json)
    return new WebViewBlock(props)
}

WebViewBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        ...Block.normalizeJSON(json),
        ...HasBackground.normalizeJSON(json),
        ...HasBorder.normalizeJSON(json),
        ...HasWebView.normalizeJSON(json)
    }
}

WebViewBlock.fields = {
    ...Block.fields,
    ...HasBackground.fields,
    ...HasBorder.fields,
    ...HasWebView.fields
}

WebViewBlock.type = new GraphQLObjectType({
    name: 'WebViewBlock',
    description: 'A web view block that contains only the publicly accessible fields',
    interfaces: [Block.type, HasBackground.type, HasBorder.type, HasWebView.type],
    fields: WebViewBlock.fields,
    isTypeOf: data => data instanceof WebViewBlock
})

export default WebViewBlock

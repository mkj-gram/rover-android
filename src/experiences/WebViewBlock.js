import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import Block from './Block'

class WebViewBlock extends Block {

	constructor(props) {
		super(props)

		const { isScrollingEnabled, url } = props

    	this.isScrollingEnabled = isScrollingEnabled
    	this.url = url
	}
}

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
        isScrollingEnabled: json['scrollable'],
        url: json['url']
    }
}

WebViewBlock.fields = {
    ...Block.fields,
    isScrollingEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
    url: { type: GraphQLString }
}

WebViewBlock.type = new GraphQLObjectType({
    name: 'WebViewBlock',
    description: 'A web view block that contains only the publicly accessible fields',
    interfaces: [Block.type],
    fields: WebViewBlock.fields,
    isTypeOf: data => data instanceof WebViewBlock
})

export default WebViewBlock

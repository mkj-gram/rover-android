import { GraphQLBoolean, 
         GraphQLInterfaceType, 
         GraphQLNonNull, 
         GraphQLString } from 'graphql'

const HasWebView = SuperClass => {

    class ChildClass extends SuperClass {

        constructor(props) {
            super(props)

            const { isScrollingEnabled, 
                    url } = props

            this.isScrollingEnabled = isScrollingEnabled
            this.url = url
        }
    }

    return ChildClass
}

HasWebView.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        isScrollingEnabled: json['scrollable'],
        url: json['url']
    }
}

HasWebView.fields = {
    isScrollingEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
    url: { type: GraphQLString }
}

HasWebView.type = new GraphQLInterfaceType({
    name: 'HasWebView',
    fields: HasWebView.fields
})

export default HasWebView

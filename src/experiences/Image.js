import { GraphQLBoolean,
         GraphQLInt, 
         GraphQLNonNull, 
         GraphQLObjectType, 
         GraphQLString } from 'graphql'

class Image {

	constructor(props) {
        
        const { height,
                isURLOptimizationEnabled,
                name,
                size,
                width,
                url } = props

		this.height = height
        this.isURLOptimizationEnabled = isURLOptimizationEnabled === undefined ? true : isURLOptimizationEnabled
        this.name = name
        this.size = size
        this.width = width
        this.url = url
	}
}

Image.fromJSON = json => {
    if (!json) {
        return null
    }

    return new Image({
        height: json['height'],
        isURLOptimizationEnabled: json['is-url-optimization-enabled'],
        name: json['name'],
        size: json['size'],
        width: json['width'],
        url: json['url']
    })
}

Image.type = new GraphQLObjectType({
    name: 'Image',
    fields: {
        height: { type: new GraphQLNonNull(GraphQLInt) },
        isURLOptimizationEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        size: { type: new GraphQLNonNull(GraphQLInt) },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        url: { type: new GraphQLNonNull(GraphQLString) }
    }
})

export default Image

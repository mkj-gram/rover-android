import {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from 'graphql'

const Image = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        height: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['height']
		},
        isURLOptimizationEnabled: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => {
                const isURLOptimizationEnabled = data['is-url-optimization-enabled']
                return isURLOptimizationEnabled === undefined ? true : isURLOptimizationEnabled
            }
		},
        name: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['name']
		},
        size: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['size']
		},
        width: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['width']
		},
        url: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['url']
		}
    })
})

export default Image

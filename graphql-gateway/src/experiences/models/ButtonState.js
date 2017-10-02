import {
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Background from './Background'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Border from './Border'
import Color from './Color'
import Font from './Font'
import Image from './Image'
import Text from './Text'
import TextAlignment from './TextAlignment'

const ButtonState = new GraphQLObjectType({
    name: 'ButtonState',
    interfaces: () => [Background, Border, Text],
    fields: () => ({
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        text: {
            type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['text']
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment),
			resolve: data => data['text-alignment']
        },
        textColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['text-color']
        },
        textFont: {
            type: new GraphQLNonNull(Font),
			resolve: data => data['text-font']
        }
    })
})

export default ButtonState

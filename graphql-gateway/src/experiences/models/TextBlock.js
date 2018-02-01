import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Action from './Action'
import Background from './Background'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Block from './Block'
import Border from './Border'
import Color from './Color'
import Font from './Font'
import HorizontalAlignment from './HorizontalAlignment'
import Image from './Image'
import Insets from './Insets'
import Length from './Length'
import LockStatus from './LockStatus'
import Offsets from './Offsets'
import Position from './Position'
import Text from './Text'
import TextAlignment from './TextAlignment'
import VerticalAlignment from './VerticalAlignment'

import { requireScope } from '../../resolvers'

const TextBlock = new GraphQLObjectType({
    name: 'TextBlock',
    interfaces: () => [Block, Background, Border, Text],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
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
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
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
        },
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

export default TextBlock

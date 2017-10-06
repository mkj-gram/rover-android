import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Action from './Action'
import Background from './Background'
import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import Block from './Block'
import Border from './Border'
import Color from './Color'
import HorizontalAlignment from './HorizontalAlignment'
import Image from './Image'
import Insets from './Insets'
import Length from './Length'
import LockStatus from './LockStatus'
import Offsets from './Offsets'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

import { requireScope } from '../../resolvers'

const WebViewBlock = new GraphQLObjectType({
    name: 'WebViewBlock',
    interfaces: () => [Block, Background, Border],
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
        isScrollingEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => data['scrollable']
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
        url: {
            type: GraphQLString,
            resolve: data => data['url']
        },
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		}
	})
})

export default WebViewBlock

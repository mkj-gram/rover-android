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
import Block from './Block'
import ButtonState from './ButtonState'
import HorizontalAlignment from './HorizontalAlignment'
import Insets from './Insets'
import Length from './Length'
import LockStatus from './LockStatus'
import Offsets from './Offsets'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

import { requireScope } from '../../resolvers'

const ButtonBlock = new GraphQLObjectType({
    name: 'ButtonBlock',
    interfaces: () => [Block],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
        disabled: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['disabled']
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
        highlighted: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['highlighted']
            })
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
        normal: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['normal']
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
        selected: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['selected']
            })
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

export default ButtonBlock

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLNonNull,
    GraphQLObjectType
} from 'graphql'

import Action from './Action'
import Block from './Block'
import ButtonState from './ButtonState'
import HorizontalAlignment from './HorizontalAlignment'
import Insets from './Insets'
import Length from './Length'
import Offsets from './Offsets'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

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
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
	    horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
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
		}
	})
})

export default ButtonBlock

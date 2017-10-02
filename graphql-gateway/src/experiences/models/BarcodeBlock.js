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
import BarcodeFormat from './BarcodeFormat'
import Block from './Block'
import Border from './Border'
import Color from './Color'
import HorizontalAlignment from './HorizontalAlignment'
import Image from './Image'
import Insets from './Insets'
import Length from './Length'
import Offsets from './Offsets'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

const BarcodeBlock = new GraphQLObjectType({
    name: 'BarcodeBlock',
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
        barcodeScale: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['barcode-scale']
        },
        barcodeText: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['barcode-text']
        },
        barcodeFormat: {
            type: new GraphQLNonNull(BarcodeFormat),
            resolve: data => data['barcode-type']
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
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
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

export default BarcodeBlock

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Action from './Action'
import BarcodeBlock from './BarcodeBlock'
import ButtonBlock from './ButtonBlock'
import GoToScreenAction from './GoToScreenAction'
import HorizontalAlignment from './HorizontalAlignment'
import ImageBlock from './ImageBlock'
import Insets from './Insets'
import Length from './Length'
import LockStatus from './LockStatus'
import Offsets from './Offsets'
import OpenUrlAction from './OpenUrlAction'
import Position from './Position'
import RectangleBlock from './RectangleBlock'
import TextBlock from './TextBlock'
import VerticalAlignment from './VerticalAlignment'
import WebViewBlock from './WebViewBlock'

const Block = new GraphQLInterfaceType({
    name: 'Block',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        experienceId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        lockStatus: {
            type: new GraphQLNonNull(LockStatus)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        offsets: {
            type: new GraphQLNonNull(Offsets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        rowId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        screenId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        }
    }),
    resolveType: data => {
        if (data['barcode-scale']) {
            return BarcodeBlock
        }

        if (data['states']) {
            return ButtonBlock
        }

        if (data['image']) {
            return ImageBlock
        }

        if (data['text']) {
            return TextBlock
        }

        if (typeof data['scrollable'] !== 'undefined') {
            return WebViewBlock
        }

        return RectangleBlock
    }
})

export default Block

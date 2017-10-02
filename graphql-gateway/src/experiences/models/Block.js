import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull
} from 'graphql'

import Action from './Action'
import BarcodeBlock from './BarcodeBlock'
import ButtonBlock from './ButtonBlock'
import GoToScreenAction from './GoToScreenAction'
import HorizontalAlignment from './HorizontalAlignment'
import ImageBlock from './ImageBlock'
import Insets from './Insets'
import Length from './Length'
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

        if (data['scrollable']) {
            return WebViewBlock
        }

        return RectangleBlock
    }
})

export default Block

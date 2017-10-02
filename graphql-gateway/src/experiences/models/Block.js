import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull
} from 'graphql'

import Action from './Action'
import ButtonBlock from './ButtonBlock'
import GoToScreenAction from './GoToScreenAction'
import HorizontalAlignment from './HorizontalAlignment'
import Insets from './Insets'
import Length from './Length'
import Offsets from './Offsets'
import OpenUrlAction from './OpenUrlAction'
import Position from './Position'
import RectangleBlock from './RectangleBlock'
import VerticalAlignment from './VerticalAlignment'

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
        if (data['states']) {
            return ButtonBlock
        }
        return RectangleBlock
    }
})

export default Block

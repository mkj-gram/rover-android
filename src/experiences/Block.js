import { GraphQLBoolean, 
         GraphQLFloat, 
         GraphQLID, 
         GraphQLInt, 
         GraphQLInterfaceType, 
         GraphQLNonNull } from 'graphql'

import BlockAction from './BlockAction'
import GoToScreenAction from './GoToScreenAction'
import HorizontalAlignment from './HorizontalAlignment'
import Insets from './Insets'
import Length from './Length'
import Offsets from './Offsets'
import OpenUrlAction from './OpenUrlAction'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

const Block = SuperClass => {

    class ChildClass extends SuperClass {

        constructor(props) {
            super(props)

            const { action,
                    autoHeight,
                    experienceId,
                    height,
                    id,
                    insets,
                    horizontalAlignment,
                    offsets,
                    opacity,
                    position,
                    rowId,
                    screenId,
                    verticalAlignment,
                    width } = props

            this.action = action
            this.autoHeight = autoHeight
            this.experienceId = experienceId
            this.height = height
            this.id = id
            this.insets = insets
            this.horizontalAlignment = horizontalAlignment
            this.offsets = offsets
            this.opacity = opacity
            this.position = position
            this.rowId = rowId
            this.screenId = screenId
            this.verticalAlignment = verticalAlignment
            this.width = width
        }
    }

    return ChildClass
}

Block.actionFromJSON = json => {
    if (!json) {
        return null
    }

    switch (json['type']) {
    case 'go-to-screen':
        return GoToScreenAction.fromJSON(json)
    case 'open-url':
        return OpenUrlAction.fromJSON(json)
    default:
        return null
    }
}

Block.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        action: Block.actionFromJSON(json['action']),
        autoHeight: json['auto-height'] || false,
        experienceId: json['experience-id'],
        height: Length.fromJSON(json['height']),
        id: json['id'],
        insets: Insets.fromJSON(json['inset']),
        horizontalAlignment: (json['alignment'] || {})['horizontal'],
        offsets: Offsets.fromJSON(json['offset']),
        opacity: json['opacity'],
        position: json['position'],
        rowId: json['row-id'],
        screenId: json['screen-id'],
        verticalAlignment: (json['alignment'] || {})['vertical'],
        width: Length.fromJSON(json['width'])
    }
}

Block.fields = {
    action: { type: BlockAction.type },
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(Length.type) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    insets: { type: new GraphQLNonNull(Insets.type) },
    horizontalAlignment: { type: new GraphQLNonNull(HorizontalAlignment.type) },
    offsets: { type: new GraphQLNonNull(Offsets.type) },
    opacity: { type: new GraphQLNonNull(GraphQLFloat) },
    position: { type: new GraphQLNonNull(Position.type) },
    rowId: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) },
    verticalAlignment: { type: new GraphQLNonNull(VerticalAlignment.type) },
    width: { type: Length.type }
}

Block.type = new GraphQLInterfaceType({
    name: 'Block',
    fields: Block.fields
})

export default Block

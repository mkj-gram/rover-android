import { GraphQLBoolean, 
         GraphQLFloat, 
         GraphQLID, 
         GraphQLInt, 
         GraphQLInterfaceType, 
         GraphQLNonNull } from 'graphql'

import BlockAction from './BlockAction'
import HorizontalAlignment from './HorizontalAlignment'
import Inset from './Inset'
import Length from './Length'
import Offset from './Offset'
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
                    inset,
                    horizontalAlignment,
                    offset,
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
            this.inset = inset
            this.horizontalAlignment = horizontalAlignment
            this.offset = offset
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

Block.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        action: (json['action'] || {})['type'],
        autoHeight: json['auto-height'] || false,
        experienceId: json['experience-id'],
        height: Length.fromJSON(json['height']),
        id: json['id'],
        inset: Inset.fromJSON(json['inset']),
        horizontalAlignment: (json['alignment'] || {})['horizontal'],
        offset: Offset.fromJSON(json['offset']),
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
    inset: { type: new GraphQLNonNull(Inset.type) },
    horizontalAlignment: { type: new GraphQLNonNull(HorizontalAlignment.type) },
    offset: { type: new GraphQLNonNull(Offset.type) },
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

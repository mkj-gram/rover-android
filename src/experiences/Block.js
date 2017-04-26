import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import BlockAction from './BlockAction'
import BorderMixin from './BorderMixin'
import Color from './Color'
import HorizontalAlignment from './HorizontalAlignment'
import Image from './Image'
import Inset from './Inset'
import Length from './Length'
import Offset from './Offset'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

class BaseBlock {

    constructor({ action,
                  autoHeight,
                  backgroundColor,
                  backgroundContentMode,
                  backgroundImage,
                  backgroundScale,
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
                  width }) {

        this.action = action
        this.autoHeight = autoHeight
        this.backgroundColor = backgroundColor
        this.backgroundContentMode = backgroundContentMode
        this.backgroundImage = backgroundImage
        this.backgroundScale = backgroundScale
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

BaseBlock.normalizeJSON = json => {
    if (!json) {
        return {}
    }
    
    return {
        action: (json['action'] || {})['type'],
        autoHeight: json['auto-height'] || false,
        backgroundColor: Color.fromJSON(json['background-color']) || new Color({
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1.0
        }),
        backgroundContentMode: json['background-content-mode'],
        backgroundImage: Image.fromJSON(json['background-image']),
        backgroundScale: json['background-scale'],
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

BaseBlock.fields = {
    action: { type: BlockAction.type },
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(Color.type) },
    backgroundContentMode: { type: BackgroundContentMode.type },
    backgroundImage: { type: Image.type },
    backgroundScale: { type: BackgroundScale.type },
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

class Block extends BorderMixin(BaseBlock) { }

Block.fromJSON = json => {
    const props = Block.normalizeJSON(json)
    return new Block(props)
}

Block.type = new GraphQLInterfaceType({
    name: 'Block',
    fields: Block.fields
})

export default Block

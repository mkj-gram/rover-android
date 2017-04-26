import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLInterfaceType, GraphQLNonNull } from 'graphql'

import BackgroundContentMode from './BackgroundContentMode'
import BackgroundScale from './BackgroundScale'
import BlockAction from './BlockAction'
import Color from './Color'
import HorizontalAlignment from './HorizontalAlignment'
import Image from './Image'
import Inset from './Inset'
import Length from './Length'
import Offset from './Offset'
import Position from './Position'
import VerticalAlignment from './VerticalAlignment'

class Block { }

Block.normalizeJSON = json => {
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
        borderColor: Color.fromJSON(json['border-color']) || new Color({
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1.0
        }),
        borderRadius: json['border-radius'] || 0,
        borderWidth: json['border-width'] || 0,
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
    backgroundColor: { type: new GraphQLNonNull(Color.type) },
    backgroundContentMode: { type: BackgroundContentMode.type },
    backgroundImage: { type: Image.type },
    backgroundScale: { type: BackgroundScale.type },
    borderColor: { type: new GraphQLNonNull(Color.type) },
    borderRadius: { type: new GraphQLNonNull(GraphQLInt) },
    borderWidth: { type: new GraphQLNonNull(GraphQLInt) },
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

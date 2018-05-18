import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

import Action from './Action'

const BackgroundContentMode = new GraphQLEnumType({
    name: 'BackgroundContentMode',
    values: {
        ORIGINAL: {
            value: 'original'
        },
        STRETCH: {
            value: 'stretch'
        },
        TILE: {
            value: 'tile'
        },
        FILL: {
            value: 'fill'
        },
        FIT: {
            value: 'fit'
        }
    }
})

const BackgroundScale = new GraphQLEnumType({
    name: 'BackgroundScale',
    values: {
        X1: {
            value: 1
        },
        X2: {
            value: 2
        },
        X3: {
            value: 3
        }
    }
})

export const BarcodeBlock = new GraphQLObjectType({
    name: 'BarcodeBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        barcodeScale: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        barcodeText: {
            type: new GraphQLNonNull(GraphQLString)
        },
        barcodeFormat: {
            type: new GraphQLNonNull(BarcodeFormat)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
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
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const BarcodeFormat = new GraphQLEnumType({
    name: 'BarcodeFormat',
    values: {
        QR_CODE: {
            value: 'qrcode'
        },
        AZTEC_CODE: {
            value: 'azteccode'
        },
        PDF417: {
            value: 'hibcpdf417'
        },
        CODE_128: {
            value: 'code128'
        }
    }
})

const Block = new GraphQLUnionType({
    name: 'Block',
    types: () => [BarcodeBlock, ButtonBlock, ImageBlock, RectangleBlock, TextBlock, WebViewBlock],
    resolveType: data => {
        if (data.barcodeText) {
            return BarcodeBlock
        }

        if (data.highlighted) {
            return ButtonBlock
        }

        if (data.image) {
            return ImageBlock
        }

        if (data.text) {
            return TextBlock
        }

        if (data.url) {
            return WebViewBlock
        }

        return RectangleBlock
    }
})

export const ButtonBlock = new GraphQLObjectType({
    name: 'ButtonBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        disabled: {
            type: new GraphQLNonNull(ButtonState)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        highlighted: {
            type: new GraphQLNonNull(ButtonState)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        normal: {
            type: new GraphQLNonNull(ButtonState)
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
        selected: {
            type: new GraphQLNonNull(ButtonState)
        },
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const ButtonState = new GraphQLObjectType({
    name: 'ButtonState',
    fields: () => ({
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment)
        },
        textColor: {
            type: new GraphQLNonNull(Color)
        },
        textFont: {
            type: new GraphQLNonNull(Font)
        }
    })
})

const Color = new GraphQLObjectType({
    name: 'Color',
    fields: () => ({
        red: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        green: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        blue: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        alpha: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const Experience = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        campaignID: {
            type: GraphQLID
        },
        homeScreenID: {
            type: new GraphQLNonNull(GraphQLString)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        screens: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen)))
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const Font = new GraphQLObjectType({
    name: 'Font',
    fields: () => ({
        size: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        weight: {
            type: new GraphQLNonNull(FontWeight)
        }
    })
})

const FontWeight = new GraphQLEnumType({
    name: 'FontWeight',
    values: {
        ULTRA_LIGHT: {
            value: 100
        },
        THIN: {
            value: 200
        },
        LIGHT: {
            value: 300
        },
        REGULAR: {
            value: 400
        },
        MEDIUM: {
            value: 500
        },
        SEMI_BOLD: {
            value: 600
        },
        BOLD: {
            value: 700
        },
        HEAVY: {
            value: 800
        },
        BLACK: {
            value: 900
        }
    }
})

const HorizontalAlignment = new GraphQLEnumType({
    name: 'HorizontalAlignment',
    values: {
        LEFT: {
            value: 'left'
        },
        RIGHT: {
            value: 'right'
        },
        CENTER: {
            value: 'center'
        },
        FILL: {
            value: 'fill'
        },
    }
})

const Image = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        height: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        isURLOptimizationEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        size: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        width: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const ImageBlock = new GraphQLObjectType({
    name: 'ImageBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        image: {
            type: Image
        },
        insets: {
            type: new GraphQLNonNull(Insets)
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
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const Insets = new GraphQLObjectType({
    name: 'Insets',
    fields: () => ({
        bottom: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        left: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        right: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        top: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
})

const Length = new GraphQLObjectType({
    name: 'Length',
    fields: () => ({
        unit: {
            type: new GraphQLNonNull(Unit)
        },
        value: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const LockStatus = new GraphQLEnumType({
    name: 'LockStatus',
    values: {
        UNLOCKED: {
            value: 'unlocked'
        },
        PARTIAL: {
            value: 'partial'
        },
        LOCKED: {
            value: 'locked'
        }
    }
})

const Offsets = new GraphQLObjectType({
    name: 'Offsets',
    fields: () => ({
        bottom: {
            type: new GraphQLNonNull(Length)
        },
        center: {
            type: new GraphQLNonNull(Length)
        },
        left: {
            type: new GraphQLNonNull(Length)
        },
        middle: {
            type: new GraphQLNonNull(Length)
        },
        right: {
            type: new GraphQLNonNull(Length)
        },
        top: {
            type: new GraphQLNonNull(Length)
        }
    })
})

const Position = new GraphQLEnumType({
    name: 'Position',
    values: {
        STACKED: {
            value: 'stacked'
        },
        FLOATING: {
            value: 'floating'
        }
    }
})

export const RectangleBlock = new GraphQLObjectType({
    name: 'RectangleBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
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
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const Row = new GraphQLObjectType({
    name: 'Row',
    fields: () => ({
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        blocks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Block)))
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const Screen = new GraphQLObjectType({
    name: 'Screen',
    fields: () => ({
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        isStretchyHeaderEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        rows: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Row)))
        },
        statusBarStyle: {
            type: new GraphQLNonNull(StatusBarStyle)
        },
        statusBarColor: {
            type: new GraphQLNonNull(Color)
        },
        titleBarBackgroundColor: {
            type: Color
        },
        titleBarButtons: {
            type: TitleBarButtons
        },
        titleBarButtonColor: {
            type: new GraphQLNonNull(Color)
        },
        titleBarText: {
            type: new GraphQLNonNull(GraphQLString)
        },
        titleBarTextColor: {
            type: new GraphQLNonNull(Color)
        },
        useDefaultTitleBarStyle: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const StatusBarStyle = new GraphQLEnumType({
    name: 'StatusBarStyle',
    values: {
        DARK: {
            value: 'dark'
        },
        LIGHT: {
            value: 'light'
        }
    }
})

const TextAlignment = new GraphQLEnumType({
    name: 'TextAlignment',
    values: {
        LEFT: {
            value: 'left'
        },
        RIGHT: {
            value: 'right'
        },
        CENTER: {
            value: 'center'
        }
    }
})

export const TextBlock = new GraphQLObjectType({
    name: 'TextBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
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
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment)
        },
        textColor: {
            type: new GraphQLNonNull(Color)
        },
        textFont: {
            type: new GraphQLNonNull(Font)
        },
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const TitleBarButtons = new GraphQLEnumType({
    name: 'TitleBarButtons',
    values: {
        CLOSE: {
            value: 'close'
        },
        BACK: {
            value: 'back'
        },
        BOTH: {
            value: 'both'
        }
    }
})

const Unit = new GraphQLEnumType({
    name: 'Unit',
    values: {
        POINTS: {
            value: 'points'
        },
        PERCENTAGE: {
            value: 'percentage'
        }
    }
})

const VerticalAlignment = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: {
            value: 'top'
        },
        BOTTOM: {
            value: 'bottom'
        },
        MIDDLE: {
            value: 'middle'
        },
        FILL: {
            value: 'fill'
        },
    }
})

export const WebViewBlock = new GraphQLObjectType({
    name: 'WebViewBlock',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        backgroundContentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        backgroundImage: {
            type: Image
        },
        backgroundScale: {
            type: new GraphQLNonNull(BackgroundScale)
        },
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
        borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        height: {
            type: new GraphQLNonNull(Length)
        },
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        isScrollingEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean)
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
        url: {
            type: GraphQLString
        },
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        },
        width: {
            type: Length
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})
export default Experience

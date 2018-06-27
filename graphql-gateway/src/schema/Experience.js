import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'
import URL from './URL'

const Background = new GraphQLObjectType({
    name: 'Background',
    fields: () => ({
        color: {
            type: new GraphQLNonNull(Color)
        },
        contentMode: {
            type: new GraphQLNonNull(BackgroundContentMode)
        },
        image: {
            type: Image
        },
        scale: {
            type: new GraphQLNonNull(BackgroundScale)
        }
    })
})

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

const Barcode = new GraphQLObjectType({
    name: 'Barcode',
    fields: () => ({
        scale: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
        format: {
            type: new GraphQLNonNull(BarcodeFormat)
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

export const BarcodeBlock = new GraphQLObjectType({
    name: 'BarcodeBlock',
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        barcode: {
            type: new GraphQLNonNull(Barcode)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const Block = new GraphQLInterfaceType({
    name: 'Block',
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    }),
    resolveType: data => {
        switch (data['__typename']) {
            case 'BarcodeBlock':
                return BarcodeBlock
            case 'ButtonBlock':
                return ButtonBlock    
            case 'ImageBlock':
                return ImageBlock
            case 'RectangleBlock':
                return RectangleBlock
            case 'TextBlock':
                return TextBlock
            case 'WebViewBlock':
                return WebViewBlock
        }
    }
})

export const GoToScreenBlockTapBehavior = new GraphQLObjectType({
    name: 'GoToScreenBlockTapBehavior',
    description: 'A tap behavior indicating the experience should navigate to a new screen when the block is tapped',
    fields: () => ({
        screenID: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const NoneBlockTapBehavior = new GraphQLObjectType({
    name: 'NoneBlockTapBehavior',
    description: 'A tap behavior indicating no action should be taken when the block is tapped',
    fields: () => ({
        placeholder: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This property should not be used. It is simply a placeholder because GraphQL does not permit types without any fields.',
            resolve: () => 'placeholder'
        }
    })
})

export const OpenURLBlockTapBehavior = new GraphQLObjectType({
    name: 'OpenURLBlockTapBehavior',
    description: 'A tap behavior indicating a URL (website or deep link) should be opened when the block is tapped',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(URL)
        },
        dismiss: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
})

export const PresentWebsiteBlockTapBehavior = new GraphQLObjectType({
    name: 'PresentWebsiteBlockTapBehavior',
    description: 'A tap behavior indicating a website should be presented within the app when the block is tapped',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(URL)
        }
    })
})

const BlockTapBehavior = new GraphQLUnionType({
    name: 'BlockTapBehavior',
    types: () => [GoToScreenBlockTapBehavior, NoneBlockTapBehavior, OpenURLBlockTapBehavior, PresentWebsiteBlockTapBehavior],
    resolveType: data => {
        switch (data['__typename']) {
            case 'GoToScreenBlockTapBehavior':
                return GoToScreenBlockTapBehavior
            case 'NoneBlockTapBehavior':
                return NoneBlockTapBehavior
            case 'OpenURLBlockTapBehavior':
                return OpenURLBlockTapBehavior
            case 'PresentWebsiteBlockTapBehavior':
                return PresentWebsiteBlockTapBehavior
        }
    }
})

export const Border = new GraphQLObjectType({
    name: 'Border',
    fields: () => ({
        color: {
            type: new GraphQLNonNull(Color)
        },
        radius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        width: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
})

export const ButtonBlock = new GraphQLObjectType({
    name: 'ButtonBlock',
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
        },
        text: {
            type: new GraphQLNonNull(Text)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
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

const Height = new GraphQLUnionType({
    name: 'Height',
    types: () => [HeightIntrinsic, HeightStatic],
    resolveType: data => {
        if (data['value'] !== null && data['value'] !== undefined) {
            return HeightStatic
        }

        return HeightIntrinsic
    }
})

const HeightIntrinsic = new GraphQLObjectType({
    name: 'HeightIntrinsic',
    fields: () => ({ 
        placeholder: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This property should not be used. It is simply a placeholder because GraphQL does not permit types without any fields.',
            resolve: () => 'placeholder'
        }
    })
})

const HeightStatic = new GraphQLObjectType({
    name: 'HeightStatic',
    fields: () => ({ 
        value: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
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
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        image: {
            type: new GraphQLNonNull(Image)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
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

const Position = new GraphQLObjectType({
    name: 'Position',
    fields: () => ({
        horizontalAlignment: {
            type: new GraphQLNonNull(HorizontalAlignment)
        },
        verticalAlignment: {
            type: new GraphQLNonNull(VerticalAlignment)
        }
    })
})

const HorizontalAlignment = new GraphQLUnionType({
    name: 'HorizontalAlignment',
    types: () => [HorizontalAlignmentCenter, HorizontalAlignmentLeft, HorizontalAlignmentRight, HorizontalAlignmentFill],
    resolveType: data => {
        switch (data['__typename']) {
            case 'HorizontalAlignmentCenter':
                return HorizontalAlignmentCenter
            case 'HorizontalAlignmentLeft':
                return HorizontalAlignmentLeft
            case 'HorizontalAlignmentRight':
                return HorizontalAlignmentRight
            case 'HorizontalAlignmentFill':
                return HorizontalAlignmentFill
        }
    }
})

const HorizontalAlignmentCenter = new GraphQLObjectType({
    name: 'HorizontalAlignmentCenter',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        width: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const HorizontalAlignmentLeft = new GraphQLObjectType({
    name: 'HorizontalAlignmentLeft',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        width: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const HorizontalAlignmentRight = new GraphQLObjectType({
    name: 'HorizontalAlignmentRight',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        width: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const HorizontalAlignmentFill = new GraphQLObjectType({
    name: 'HorizontalAlignmentFill',
    fields: () => ({
        leftOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        rightOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const VerticalAlignment = new GraphQLUnionType({
    name: 'VerticalAlignment',
    types: () => [VerticalAlignmentBottom, VerticalAlignmentMiddle, VerticalAlignmentFill, VerticalAlignmentStacked, VerticalAlignmentTop],
    resolveType: data => {
        switch (data['__typename']) {
            case 'VerticalAlignmentBottom':
                return VerticalAlignmentBottom
            case 'VerticalAlignmentMiddle':
                return VerticalAlignmentMiddle
            case 'VerticalAlignmentFill':
                return VerticalAlignmentFill
            case 'VerticalAlignmentStacked':
                return VerticalAlignmentStacked
            case 'VerticalAlignmentTop':
                return VerticalAlignmentTop
        }
    }
})

const VerticalAlignmentBottom = new GraphQLObjectType({
    name: 'VerticalAlignmentBottom',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        height: {
            type: new GraphQLNonNull(Height)
        }
    })
})

const VerticalAlignmentMiddle = new GraphQLObjectType({
    name: 'VerticalAlignmentMiddle',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        height: {
            type: new GraphQLNonNull(Height)
        }
    })
})

const VerticalAlignmentFill = new GraphQLObjectType({
    name: 'VerticalAlignmentFill',
    fields: () => ({
        topOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        bottomOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        }
    })
})

const VerticalAlignmentStacked = new GraphQLObjectType({
    name: 'VerticalAlignmentStacked',
    fields: () => ({
        topOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        bottomOffset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        height: {
            type: new GraphQLNonNull(Height)
        }
    })
})

const VerticalAlignmentTop = new GraphQLObjectType({
    name: 'VerticalAlignmentTop',
    fields: () => ({
        offset: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        height: {
            type: new GraphQLNonNull(Height)
        }
    })
})

export const RectangleBlock = new GraphQLObjectType({
    name: 'RectangleBlock',
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
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
        background: {
            type: new GraphQLNonNull(Background)
        },
        blocks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Block)))
        },
        height: {
            type: new GraphQLNonNull(Height)
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
        background: {
            type: new GraphQLNonNull(Background)
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
        statusBar: {
            type: new GraphQLNonNull(StatusBar)
        },
        titleBar: {
            type: new GraphQLNonNull(TitleBar)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

const StatusBar = new GraphQLObjectType({
    name: 'StatusBar',
    fields: () => ({
        style: {
            type: new GraphQLNonNull(StatusBarStyle)
        },
        color: {
            type: new GraphQLNonNull(Color)
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

const TitleBar = new GraphQLObjectType({
    name: 'TitleBar',
    fields: () => ({
        backgroundColor: {
            type: new GraphQLNonNull(Color)
        },
        buttons: {
            type: new GraphQLNonNull(TitleBarButtons)
        },
        buttonColor: {
            type: new GraphQLNonNull(Color)
        },
        text: {
            type: new GraphQLNonNull(GraphQLString)
        },
        textColor: {
            type: new GraphQLNonNull(Color)
        },
        useDefaultStyle: {
            type: new GraphQLNonNull(GraphQLBoolean)
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

const Text = new GraphQLObjectType({
    name: 'Text',
    fields: () => ({
        rawValue: {
            type: new GraphQLNonNull(GraphQLString)
        },
        alignment: {
            type: new GraphQLNonNull(TextAlignment)
        },
        color: {
            type: new GraphQLNonNull(Color)
        },
        font: {
            type: new GraphQLNonNull(Font)
        }
    })
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

export const TextBlock = new GraphQLObjectType({
    name: 'TextBlock',
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
        },
        text: {
            type: new GraphQLNonNull(Text)
        },
        keys: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        tags: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
        }
    })
})

export const WebView = new GraphQLObjectType({
    name: 'WebView',
    fields: () => ({
        isScrollingEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const WebViewBlock = new GraphQLObjectType({
    name: 'WebViewBlock',
    interfaces: () => [Block],
    fields: () => ({
        background: {
            type: new GraphQLNonNull(Background)
        },
        border: {
            type: new GraphQLNonNull(Border)
        },
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        insets: {
            type: new GraphQLNonNull(Insets)
        },
        opacity: {
            type: new GraphQLNonNull(GraphQLFloat)
        },
        position: {
            type: new GraphQLNonNull(Position)
        },
        tapBehavior: {
            type: new GraphQLNonNull(BlockTapBehavior)
        },
        webView: {
            type: new GraphQLNonNull(WebView)
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

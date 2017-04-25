import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

// MARK: Other types

const BackgroundContentModeType = new GraphQLEnumType({
    name: 'BackgroundContentMode',
    values: {
        ORIGINAL: { value: 'original' },
        STRETCH: { value: 'stretch' },
        TILE: { value: 'tile' },
        FILL: { value: 'fill' },
        FIT: { value: 'fit' }
    }
})

const BackgroundScaleType = new GraphQLEnumType({
    name: 'BackgroundScale',
    values: {
        X1: { value: 1 },
        X2: { value: 2 },
        X3: { value: 3 }
    }
})

const BarcodeFormatType = new GraphQLEnumType({
    name: 'BarcodeFormat',
    values: {
        QR: { value: 'QR' },
        AZTEC: { value: 'AZTEC' },
        PDF417: { value: 'PDF417' },
        CODE128: { value: 'CODE128' }
    }
})

const BlockActionType = new GraphQLEnumType({
    name: 'BlockAction',
    values: {
        GO_TO_SCREEN: { value: 'go-to-screen' },
        OPEN_URL: { value: 'open-url' }
    }
})

const ColorType = new GraphQLObjectType({
    name: 'Color',
    fields: {
        red: { type: new GraphQLNonNull(GraphQLInt) },
        green: { type: new GraphQLNonNull(GraphQLInt) },
        blue: { type: new GraphQLNonNull(GraphQLInt) },
        alpha: { type: new GraphQLNonNull(GraphQLFloat) }
    }
})

const FontWeightType = new GraphQLEnumType({
    name: 'FontWeight',
    values: {
        ULTRA_LIGHT: { value: 100 },
        THIN: { value: 200 },
        LIGHT: { value: 300 },
        REGULAR: { value: 400 },
        MEDIUM: { value: 500 },
        SEMI_BOLD: { value: 600 },
        BOLD: { value: 700 },
        HEAVY: { value: 800 },
        BLACK: { value: 900 }
    }
})

const HorizontalAlignmentType = new GraphQLEnumType({
    name: 'HorizontalAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' },
        JUSTIFY: { value: 'fill' },
    }
})

const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: {
        height: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        size: { type: new GraphQLNonNull(GraphQLInt) },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        url: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const InsetType = new GraphQLObjectType({
    name: 'Inset',
    fields: {
        bottom: { type: new GraphQLNonNull(GraphQLInt) },
        left: { type: new GraphQLNonNull(GraphQLInt) },
        right: { type: new GraphQLNonNull(GraphQLInt) },
        top: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

const LockStatusType = new GraphQLEnumType({
    name: 'LockStatus',
    values: {
        PARTIAL: { value: 'partial' },
        LOCKED: { value: 'locked' }
    }
})

const UnitType = new GraphQLEnumType({
    name: 'Unit',
    values: {
        POINTS: { value: 'points' },
        PERCENTAGE: { value: 'percentage' }
    }
})

const LengthType = new GraphQLObjectType({
    name: 'Length',
    fields: {
        unit: { type: new GraphQLNonNull(UnitType) },
        value: { type: new GraphQLNonNull(GraphQLFloat) }
    }
})

const OffsetType = new GraphQLObjectType({
    name: 'Offset',
    fields: {
        bottom: { type: new GraphQLNonNull(LengthType) },
        center: { type: new GraphQLNonNull(LengthType) },
        left: { type: new GraphQLNonNull(LengthType) },
        middle: { type: new GraphQLNonNull(LengthType) },
        right: { type: new GraphQLNonNull(LengthType) },
        top: { type: new GraphQLNonNull(LengthType) }
    }
})

const PositionType = new GraphQLEnumType({
    name: 'Position',
    values: {
        STACKED: { value: 'stacked' },
        FLOATING: { value: 'floating' }
    }
})

const StatusBarStyleType = new GraphQLEnumType({
    name: 'StatusBarStyle',
    values: {
        DARK: { value: 'dark' },
        LIGHT: { value: 'light' }
    }
})

const TextAlignmentType = new GraphQLEnumType({
    name: 'TextAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' },
    }
})

const TitleBarButtonsType = new GraphQLEnumType({
    name: 'TitleBarButtons',
    values: {
        CLOSE: { value: 'close' },
        BACK: { value: 'back' },
        BOTH: { value: 'both' }
    }
})

const VerticalAlignmentType = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        MIDDLE: { value: 'middle' },
        JUSTIFY: { value: 'justify' },
    }
})

// MARK: Block

const baseBlockFields = {
    action: { type: BlockActionType },
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(ColorType) },
    backgroundContentMode: { type: BackgroundContentModeType },
    backgroundImage: { type: ImageType },
    backgroundScale: { type: BackgroundScaleType },
    borderColor: { type: new GraphQLNonNull(ColorType) },
    borderRadius: { type: new GraphQLNonNull(GraphQLInt) },
    borderWidth: { type: new GraphQLNonNull(GraphQLInt) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(LengthType) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    horizontalAlignment: { type: new GraphQLNonNull(HorizontalAlignmentType) },
    offset: { type: new GraphQLNonNull(OffsetType) },
    opacity: { type: new GraphQLNonNull(GraphQLFloat) },
    position: { type: new GraphQLNonNull(PositionType) },
    rowId: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) },
    verticalAlignment: { type: new GraphQLNonNull(VerticalAlignmentType) },
    width: { type: LengthType }
}

const barcodeBlockFields = {
    barCodeScale: { type: GraphQLString },
    barcodeText: { type: GraphQLString },
    barcodeFormat: { type: new GraphQLNonNull(BarcodeFormatType) }
}

const imageBlockFields = {
    image: { type: ImageType }
}

const textBlockFields = {
    fontSize: { type: new GraphQLNonNull(GraphQLInt) },
    fontWeight: { type: new GraphQLNonNull(FontWeightType) },
    inset: { type: new GraphQLNonNull(InsetType) },
    text: { type: GraphQLString },
    textAlignment: { type: new GraphQLNonNull(TextAlignmentType) },
    textColor: { type: new GraphQLNonNull(ColorType) }
}

const webViewBlockFields = {
    isScrollingEnabled: { type: new GraphQLNonNull(GraphQLBoolean) },
    url: { type: GraphQLString }
}

const editableBlockFields = {
    clickCount: { type: GraphQLInt },
    editorState: { type: GraphQLString },
    lockStatus: { type: new GraphQLNonNull(LockStatusType) },
    name: { type: new GraphQLNonNull(GraphQLString) }
}

const BlockType = new GraphQLObjectType({
    name: 'Block',
    description: 'A block that contains only the publicly accessible fields',
    fields: baseBlockFields
})

const BarcodeBlockType = new GraphQLObjectType({
    name: 'BarcodeBlock',
    description: 'A barcode block that contains only the publicly accessible fields',
    fields: {
        ...baseBlockFields,
        ...barcodeBlockFields
    }
})

const ButtonBlockType = new GraphQLObjectType({
    name: 'ButtonBlock',
    description: 'A button block that contains only the publicly accessible fields',
    fields: {
        ...baseBlockFields,
        ...textBlockFields
    }
})

const ImageBlockType = new GraphQLObjectType({
    name: 'ImageBlock',
    description: 'An image block that contains only the publicly accessible fields',
    fields: {
        ...baseBlockFields,
        ...imageBlockFields
    }
})

const TextBlockType = new GraphQLObjectType({
    name: 'TextBlock',
    description: 'A text block that contains only the publicly accessible fields',
    fields: {
        ...baseBlockFields,
        ...textBlockFields
    }
})

const WebViewBlockType = new GraphQLObjectType({
    name: 'WebViewBlock',
    description: 'A web view block that contains only the publicly accessible fields',
    fields: {
        ...baseBlockFields,
        ...webViewBlockFields
    }
})

const EditableBlockType = new GraphQLObjectType({
    name: 'EditableBlockType',
    description: 'A block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...editableBlockFields
    }
})

const EditableBarcodeBlockType = new GraphQLObjectType({
    name: 'EditableBarcodeBlock',
    description: 'A barcode block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...barcodeBlockFields,
        ...editableBlockFields
    }
})

const EditableButtonBlockType = new GraphQLObjectType({
    name: 'EditableButtonBlock',
    description: 'A button block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...textBlockFields,
        ...editableBlockFields
    }
})

const EditableImageBlockType = new GraphQLObjectType({
    name: 'EditableImageBlock',
    description: 'An image block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...imageBlockFields,
        ...editableBlockFields
    }
})

const EditableTextBlockType = new GraphQLObjectType({
    name: 'EditableTextBlock',
    description: 'A text block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...textBlockFields,
        ...editableBlockFields
    }
})

const EditableWebViewBlockType = new GraphQLObjectType({
    name: 'EditableWebViewBlock',
    description: 'A web view block that includes fields related to authoring/editing',
    fields: {
        ...baseBlockFields,
        ...webViewBlockFields,
        ...editableBlockFields
    }
})

// MARK: Row

const baseRowFields = {
    autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(ColorType) },
    backgroundImage: { type: ImageType },
    backgroundContentMode: { type: BackgroundContentModeType },
    backgroundScale: { type: BackgroundScaleType },
    blocks: { type: new GraphQLNonNull(new GraphQLList(BlockType)) },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    height: { type: new GraphQLNonNull(LengthType) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    screenId: { type: new GraphQLNonNull(GraphQLID) }
}

const RowType = new GraphQLObjectType({
    name: 'Row',
    description: 'A row that contains only the publicly accessible fields',
    fields: baseRowFields
})

const EditableRowType = new GraphQLObjectType({
    name: 'Row',
    description: 'A row that includes fields related to authoring/editing',
    fields: {
        ...baseRowFields,
        blocks: { type: new GraphQLNonNull(new GraphQLList(EditableBlockType)) },
        isCollapsed: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) }
    }
})

// MARK: Screen

const baseScreenFields = {
    autoColorStatusBar: { type: new GraphQLNonNull(GraphQLBoolean) },
    backgroundColor: { type: new GraphQLNonNull(ColorType) },
    backgroundImage: { type: ImageType },
    backgroundContentMode: { type: BackgroundContentModeType },
    backgroundScale: { type: BackgroundScaleType },
    experienceId: { type: new GraphQLNonNull(GraphQLID) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    rows: { type: new GraphQLNonNull(new GraphQLList(RowType)) },
    statusBarStyle: { type: new GraphQLNonNull(StatusBarStyleType) },
    statusBarColor: { type: new GraphQLNonNull(ColorType) },
    titleBarBackgroundColor: { type: ColorType },
    titleBarButtons: { type: TitleBarButtonsType },
    titleBarButtonColor: { type: new GraphQLNonNull(ColorType) },
    titleBarText: { type: GraphQLString },
    titleBarTextColor: { type: ColorType },
    useDefaultTitleBarStyle: { type: new GraphQLNonNull(GraphQLBoolean) }
}

const ScreenType = new GraphQLObjectType({
    name: 'Screen',
    description: 'A screen that contains only the publicly accessible fields',
    fields: baseScreenFields
})

const EditableScreenType = new GraphQLObjectType({
    name: 'EditableScreen',
    description: 'A screen that includes fields related to authoring/editing',
    fields: {
        ...baseScreenFields,
        hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        rows: { type: new GraphQLNonNull(new GraphQLList(EditableRowType)) },
        views: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

// MARK: Experience

const baseExperienceFields = {
    id: { type: new GraphQLNonNull(GraphQLID) },
    homeScreenId: { type: new GraphQLNonNull(GraphQLString) },
    screens: { type: new GraphQLNonNull(new GraphQLList(ScreenType)) }
}

const ExperienceType = new GraphQLObjectType({
    name: 'Experience',
    description: 'An experience that contains only the publicly accessible fields',
    fields: baseExperienceFields
})

const EditableExperienceType = new GraphQLObjectType({
    name: 'EditableExperience',
    description: 'An experience that includes fields related to authoring/editing',
    fields: {
        ...baseExperienceFields,
        hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
        isArchived: { type: new GraphQLNonNull(GraphQLBoolean) },
        isPublished: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        screens: { type: new GraphQLNonNull(new GraphQLList(EditableScreenType)) },
        simulatorUrl: { type: new GraphQLNonNull(GraphQLString) },
        viewToken: { type: new GraphQLNonNull(GraphQLString) },
        versionId: { type: GraphQLString },
        recentAverageDuration: { type: GraphQLInt }
    }
})

export {
    ExperienceType,
    EditableExperienceType
}

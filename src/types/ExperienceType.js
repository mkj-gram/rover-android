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

export const ExperienceType = new GraphQLObjectType({
    name: 'Experience',
    description: 'RoverExperience',
    fields: () =>  ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
        homeScreenId: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        isArchived: { type: new GraphQLNonNull(GraphQLBoolean) },
        isPublished: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        screens: { type: new GraphQLNonNull(new GraphQLList(ScreenObjectType)) },
        simulatorUrl: { type: new GraphQLNonNull(GraphQLString) },
        viewToken: { type: new GraphQLNonNull(GraphQLString) },
        versionId: { type: GraphQLString },
        recentAverageDuration: { type: GraphQLInt }
    })
})

const ScreenObjectType = new GraphQLObjectType({
    name: 'ScreenObject',
    description: 'Rover Experience Screen',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        backgroundColor: { type: new GraphQLNonNull(ColorType) },
        backgroundImage: { type: ContentImageType },
        backgroundContentMode: { type: GraphQLString },
        backgroundScale: { type: GraphQLString },
        experienceId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        rows: { type: new GraphQLList(RowObjectType) },
        statusBarStyle: { type: GraphQLString },
        statusBarColor: { type: ColorType },
        autoColorStatusBar: { type: new GraphQLNonNull(GraphQLBoolean) },
        titleBarBackgroundColor: { type: ColorType },
        titleBarButtons: { type: TitleBarButtonsType },
        titleBarButtonColor: { type: new GraphQLNonNull(ColorType) },
        titleBarText: { type: GraphQLString },
        titleBarTextColor: { type: ColorType },
        useDefaultTitleBarStyle: { type: new GraphQLNonNull(GraphQLString) },
        hasUnpublishedChanges: { type: new GraphQLNonNull(GraphQLBoolean) },
        views: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const TitleBarButtonsType = new GraphQLEnumType({
  name: 'TitleBarButtons',
  values: {
    CLOSE: { value: 'close' },
    BACK: { value: 'back' },
    BOTH: { value: 'both' }
  }
})

const RowObjectType = new GraphQLObjectType({
    name: 'RowObject',
    description: 'Rover Experience Row',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
        backgroundColor: { type: new GraphQLNonNull(ColorType) },
        backgroundImage: { type: ContentImageType },
        backgroundContentMode: { type: GraphQLString },
        backgroundScale: { type: GraphQLString },
        blocks: { type: new GraphQLList(BlockObjectType) },
        experienceId: { type: new GraphQLNonNull(GraphQLString) },
        height: { type: new GraphQLNonNull(GraphQLInt) },
        isCollapsed: { type: new GraphQLNonNull(GraphQLBoolean) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        screenId: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const BlockObjectType = new GraphQLObjectType({
    name: 'BlockObject',
    description: 'Rover Experience Block',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        action: { type: BlockActionType },
        alignment: { type: new GraphQLNonNull(GraphQLString) },
        autoHeight: { type: new GraphQLNonNull(GraphQLBoolean) },
        backgroundColor: { type: ColorType },
        backgroundContentMode: { type: GraphQLString },
        backgroundImage: { type: ContentImageType },
        backgroundScale: { type: GraphQLString },
        barcodeType: {
            type: new GraphQLEnumType({
                name: 'BarcodeBlockType',
                values: {
                    QR: { value: 'QR' },
                    AZTEC: { value: 'AZTEC' },
                    PDF417: { value: 'PDF417' },
                    CODE128: { value: 'CODE128' }
                }
            })
        },
        barcodeText: { type: GraphQLString },
        barCodeScale: { type: GraphQLString },
        borderColor: { type: ColorType },
        borderRadius: { type: GraphQLInt },
        borderWidth: { type: GraphQLInt },
        bottom: { type: GraphQLInt },
        center: { type: GraphQLInt },
        clickCount: { type: GraphQLInt },
        color: { type: ColorType },
        editorState: { type: GraphQLString },
        experienceId: { type: new GraphQLNonNull(GraphQLString) },
        fontSize: { type: GraphQLInt },
        fontWeight: { type: GraphQLInt },
        height: { type: new GraphQLNonNull(GraphQLInt) },
        horizontalAlign: {
            type: new GraphQLEnumType({
                name: 'HorizontalAlignType',
                values: {
                    LEFT: { value: 'left' },
                    RIGHT: { value: 'right' },
                    CENTER: { value: 'center' },
                    JUSTIFY: { value: 'justify' },
                }
            })
        },
        image: { type: ContentImageType },
        inset: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        left: { type: GraphQLInt },
        lockStatus: { type: new GraphQLNonNull(GraphQLBoolean) },
        middle: { type: GraphQLInt },
        name: { type: new GraphQLNonNull(GraphQLString) },
        opacity: { type: new GraphQLNonNull(GraphQLFloat) },
        position: {
            type: new GraphQLEnumType({
                name: 'PositionType',
                values: {
                    STACKED: { value: 'stacked' },
                    FLOATING: { value: 'floating' }
                }
            })
        },
        right: { type: GraphQLInt },
        rowId: { type: new GraphQLNonNull(GraphQLString) },
        screenId: { type: new GraphQLNonNull(GraphQLString) },
        scrollable: { type: new GraphQLNonNull(GraphQLBoolean) },
        text: { type: GraphQLString },
        textAlign: {
            type: new GraphQLEnumType({
                name: 'TextAlignType',
                values: {
                    LEFT: { value: 'left' },
                    RIGHT: { value: 'right' },
                    CENTER: { value: 'center' },
                }
            })
        },
        top: { type: GraphQLString },
        url: { type: GraphQLString },
        verticalAlign: {
            type: new GraphQLEnumType({
                name: 'VerticalAlignType',
                values: {
                    TOP: { value: 'top' },
                    BOTTOM: { value: 'bottom' },
                    MIDDLE: { value: 'middle' },
                    JUSTIFY: { value: 'justify' },
                }
            })
        },
    })
})

const ContentImageType = new GraphQLObjectType({
    name: 'ContentImage',
    description: 'Image type for Rover Experience Content',
    fields: () => ({
        height: { type: new GraphQLNonNull(GraphQLInt) },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const ColorType = new GraphQLObjectType({
    name: 'Color',
    description: 'Color RBGA object',
    fields: () => ({
        red: { type: new GraphQLNonNull(GraphQLInt) },
        green: { type: new GraphQLNonNull(GraphQLInt) },
        blue: { type: new GraphQLNonNull(GraphQLInt) },
        alpha: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const BlockActionType = new GraphQLEnumType({
    name: 'BlockAction',
    values: {
        GOTOSCREEN: { value: 'go-to-screen' },
        OPENURL: { value: 'open-external-url' }
    }
})

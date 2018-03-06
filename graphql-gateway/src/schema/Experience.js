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

import { requireScope } from '../resolvers'

const Action = new GraphQLUnionType({
    name: 'Action',
    types: () => [GoToScreenAction, OpenUrlAction],
    resolveType: data => {
        if (data['url']) {
            return OpenUrlAction
        }

        return GoToScreenAction
    }
})

const Background = new GraphQLInterfaceType({
    name: 'Background',
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
		}
	}),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
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

            if (typeof data['scrollable'] !== 'undefined') {
                return WebViewBlock
            }

            return RectangleBlock
        }

        if (data['experience-id'] && data['screen-id']) {
            return Row
        }

        if (data['experience-id']) {
            return Screen
        }

        return ButtonState
    }
})

const BackgroundContentMode = new GraphQLEnumType({
    name: 'BackgroundContentMode',
    values: {
        ORIGINAL: { value: 'original' },
        STRETCH: { value: 'stretch' },
        TILE: { value: 'tile' },
        FILL: { value: 'fill' },
        FIT: { value: 'fit' }
    }
})

const BackgroundScale = new GraphQLEnumType({
    name: 'BackgroundScale',
    values: {
        X1: { value: 1 },
        X2: { value: 2 },
        X3: { value: 3 }
    }
})

export const BarcodeBlock = new GraphQLObjectType({
    name: 'BarcodeBlock',
    interfaces: () => [Block, Background, Border],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        barcodeScale: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['barcode-scale']
        },
        barcodeText: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['barcode-text']
        },
        barcodeFormat: {
            type: new GraphQLNonNull(BarcodeFormat),
            resolve: data => data['barcode-type']
        },
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },

        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

const BarcodeFormat = new GraphQLEnumType({
    name: 'BarcodeFormat',
    values: {
        QR_CODE: { value: 'qrcode' },
        AZTEC_CODE: { value: 'azteccode' },
        PDF417: { value: 'hibcpdf417' },
        CODE_128: { value: 'code128' }
    }
})

const Block = new GraphQLInterfaceType({
    name: 'Block',
    fields: () => ({
        action: {
            type: Action
        },
        autoHeight: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt)
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
        lockStatus: {
            type: new GraphQLNonNull(LockStatus)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
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
        },
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON)
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

        if (typeof data['scrollable'] !== 'undefined') {
            return WebViewBlock
        }

        return RectangleBlock
    }
})

const Border = new GraphQLInterfaceType({
    name: 'Border',
    fields: () => ({
        borderColor: {
            type: new GraphQLNonNull(Color)
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt)
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
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

            if (typeof data['scrollable'] !== 'undefined') {
                return WebViewBlock
            }

            return RectangleBlock
        }

        return ButtonState
    }
})

export const ButtonBlock = new GraphQLObjectType({
    name: 'ButtonBlock',
    interfaces: () => [Block],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
        disabled: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['disabled']
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        highlighted: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['highlighted']
            })
        },
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
        normal: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['normal']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
        selected: {
            type: new GraphQLNonNull(ButtonState),
			resolve: data => ({
                'background-content-mode': data['background-content-mode'],
                'background-image': data['background-image'],
                'background-scale': data['background-scale'],
                ...(data['states'] || {})['selected']
            })
        },
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

const ButtonState = new GraphQLObjectType({
    name: 'ButtonState',
    interfaces: () => [Background, Border, Text],
    fields: () => ({
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        text: {
            type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['text']
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment),
			resolve: data => data['text-alignment']
        },
        textColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['text-color']
        },
        textFont: {
            type: new GraphQLNonNull(Font),
			resolve: data => data['text-font']
        }
    })
})

const Color = new GraphQLObjectType({
    name: 'Color',
    fields: () => ({
        red: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['red']
        },
        green: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['green']
        },
        blue: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['blue']
        },
        alpha: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: data => data['alpha']
        }
    })
})

const Experience = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        campaignId: {
            type: GraphQLID
        },
        hasUnpublishedChanges: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['has-unpublished-changes']
            })
        },
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
            resolve: data => data['custom-keys']
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        isArchived: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['is-archived']
            })
        },
        isPublished: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['is-published']
            })
        },
        homeScreenId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['home-screen-id']
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
        recentAverageDuration: {
            type: GraphQLInt,
            resolve: requireScope('admin', data => {
                return data['recent-average-duraction']
            })
        },
        screens: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen))),
            resolve: data => data['screens']
        },
        simulatorUrl: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['simulator-url']
            })
        },
        versionId: {
            type: GraphQLString,
            resolve: requireScope('admin', data => {
                return data['version-id']
            })
        },
        viewToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['view-token']
            })
        }
    })
})

const Font = new GraphQLObjectType({
    name: 'Font',
    fields: () => ({
        size: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: data => data['size']
        },
        weight: {
            type: new GraphQLNonNull(FontWeight),
            resolve: data => data['weight']
        }
    })
})

const FontWeight = new GraphQLEnumType({
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

const GoToScreenAction = new GraphQLObjectType({
    name: 'GoToScreenAction',
    fields: () => ({
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		}
	})
})

const HorizontalAlignment = new GraphQLEnumType({
    name: 'HorizontalAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' },
        FILL: { value: 'fill' },
    }
})

const Image = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        height: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['height']
		},
        isURLOptimizationEnabled: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => {
                const isURLOptimizationEnabled = data['is-url-optimization-enabled']
                return isURLOptimizationEnabled === undefined ? true : isURLOptimizationEnabled
            }
		},
        name: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['name']
		},
        size: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['size']
		},
        width: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['width']
		},
        url: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['url']
		}
    })
})

export const ImageBlock = new GraphQLObjectType({
    name: 'ImageBlock',
    interfaces: () => [Block, Background, Border],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
        image: {
            type: Image,
            resolve: data => data['image']
        },
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

const Insets = new GraphQLObjectType({
    name: 'Insets',
    fields: () => ({
        bottom: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['bottom']
		},
        left: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['left']
		},
        right: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['right']
		},
        top: {
			type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['top']
		}
    })
})

const Length = new GraphQLObjectType({
    name: 'Length',
    fields: () => ({
        unit: {
			type: new GraphQLNonNull(Unit),
			resolve: data => data['type']
		},
        value: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['value']
		}
    })
})

const LockStatus = new GraphQLEnumType({
    name: 'LockStatus',
    values: {
    	UNLOCKED: { value: 'unlocked' },
        PARTIAL: { value: 'partial' },
        LOCKED: { value: 'locked' }
    }
})

const Offsets = new GraphQLObjectType({
    name: 'Offsets',
    fields: () => ({
        bottom: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['bottom']
		},
        center: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['center']
		},
        left: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['left']
		},
        middle: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['middle']
		},
        right: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['right']
		},
        top: {
			type: new GraphQLNonNull(Length),
			 resolve: data => data['top']
		}
    })
})

const OpenUrlAction = new GraphQLObjectType({
    name: 'OpenUrlAction',
    fields: () => ({
		url: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['url']
		}
	})
})

const Position = new GraphQLEnumType({
    name: 'Position',
    values: {
        STACKED: { value: 'stacked' },
        FLOATING: { value: 'floating' }
    }
})

export const RectangleBlock = new GraphQLObjectType({
    name: 'RectangleBlock',
    interfaces: () => [Block, Background, Border],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

const Row = new GraphQLObjectType({
    name: 'Row',
    interfaces: () => [Background],
    fields: () => ({
		autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height']
		},
		backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
	    blocks: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Block))),
			resolve: data => data['blocks']
		},
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
        isCollapsed: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['is-collapsed']
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
            resolve: data => data['custom-keys']
        }
	})
})

const Screen = new GraphQLObjectType({
    name: 'Screen',
	interfaces: () => [Background],
    fields: () => ({
        autoColorStatusBar: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['status-bar-auto-color']
            })
        },
		backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        experienceId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['experience-id']
        },
        hasUnpublishedChanges: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['has-unpublished-changes']
            })
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        isStretchyHeaderEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
				const isStretchyHeaderEnabled = data['is-stretchy-header-enabled']
				return isStretchyHeaderEnabled === undefined ? true : isStretchyHeaderEnabled
			}
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
        rows: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Row))),
            resolve: data => data['rows']
        },
        statusBarStyle: {
            type: new GraphQLNonNull(StatusBarStyle),
            resolve: data => data['status-bar-style']
        },
        statusBarColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['status-bar-color']
        },
        titleBarBackgroundColor: {
            type: Color,
            resolve: data => data['title-bar-background-color']
        },
        titleBarButtons: {
            type: TitleBarButtons,
            resolve: data => data['title-bar-buttons']
        },
        titleBarButtonColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['title-bar-button-color']
        },
        titleBarText: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['title']
        },
        titleBarTextColor: {
            type: new GraphQLNonNull(Color),
            resolve: data => data['title-bar-text-color']
        },
        useDefaultTitleBarStyle: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => data['use-default-title-bar-style']
        },
        views: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['views'] || 0
            })
        },
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
            resolve: data => data['custom-keys']
        }
    })
})

const StatusBarStyle = new GraphQLEnumType({
    name: 'StatusBarStyle',
    values: {
        DARK: { value: 'dark' },
        LIGHT: { value: 'light' }
    }
})

const Text = new GraphQLInterfaceType({
    name: 'Text',
    fields: () => ({
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
    }),
    resolveType: data => {
        if (data['experience-id'] && data['screen-id'] && data['row-id']) {
            return TextBlock
        }

        return ButtonState
    }
})

const TextAlignment = new GraphQLEnumType({
    name: 'TextAlignment',
    values: {
        LEFT: { value: 'left' },
        RIGHT: { value: 'right' },
        CENTER: { value: 'center' }
    }
})

export const TextBlock = new GraphQLObjectType({
    name: 'TextBlock',
    interfaces: () => [Block, Background, Border, Text],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
        text: {
            type: new GraphQLNonNull(GraphQLString),
			resolve: data => data['text']
        },
        textAlignment: {
            type: new GraphQLNonNull(TextAlignment),
			resolve: data => data['text-alignment']
        },
        textColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['text-color']
        },
        textFont: {
            type: new GraphQLNonNull(Font),
			resolve: data => data['text-font']
        },
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})

const TitleBarButtons = new GraphQLEnumType({
    name: 'TitleBarButtons',
    values: {
        CLOSE: { value: 'close' },
        BACK: { value: 'back' },
        BOTH: { value: 'both' }
    }
})

const Unit = new GraphQLEnumType({
    name: 'Unit',
    values: {
        POINTS: { value: 'points' },
        PERCENTAGE: { value: 'percentage' }
    }
})

const VerticalAlignment = new GraphQLEnumType({
    name: 'VerticalAlignment',
    values: {
        TOP: { value: 'top' },
        BOTTOM: { value: 'bottom' },
        MIDDLE: { value: 'middle' },
        FILL: { value: 'fill' },
    }
})

export const WebViewBlock = new GraphQLObjectType({
    name: 'WebViewBlock',
    interfaces: () => [Block, Background, Border],
    fields: () => ({
	    action: {
			type: Action,
			resolve: data => data['action']
		},
	    autoHeight: {
			type: new GraphQLNonNull(GraphQLBoolean),
			resolve: data => data['auto-height'] || false,
		},
        backgroundColor: {
			type: new GraphQLNonNull(Color),
			resolve: data => data['background-color']
		},
	    backgroundContentMode: {
			type: new GraphQLNonNull(BackgroundContentMode),
			resolve: data => data['background-content-mode'] || 'original'
		},
	    backgroundImage: {
			type: Image,
			resolve: data => data['background-image']
		},
	    backgroundScale: {
			type: new GraphQLNonNull(BackgroundScale),
			resolve: data => data['background-scale'] || 1
		},
        borderColor: {
            type: new GraphQLNonNull(Color),
			resolve: data => data['border-color']
        },
    	borderRadius: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-radius']
        },
    	borderWidth: {
            type: new GraphQLNonNull(GraphQLInt),
			resolve: data => data['border-width']
        },
        clickCount: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: requireScope('admin', data => {
                return data['click-count'] || 0
            })
        },
	    experienceId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['experience-id']
		},
	    height: {
			type: new GraphQLNonNull(Length),
			resolve: data => data['height']
		},
        horizontalAlignment: {
			type: new GraphQLNonNull(HorizontalAlignment),
			resolve: data => (data['alignment'] || {})['horizontal']
		},
	    id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['id']
		},
	    insets: {
			type: new GraphQLNonNull(Insets),
			resolve: data => data['inset']
		},
        isScrollingEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => data['scrollable']
        },
        lockStatus: {
            type: new GraphQLNonNull(LockStatus),
            resolve: requireScope('admin', data => {
                return data['lock-status'] || 'unlocked'
            })
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
	    offsets: {
			type: new GraphQLNonNull(Offsets),
			resolve: data => data['offset']
		},
	    opacity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: data => data['opacity']
		},
	    position: {
			type: new GraphQLNonNull(Position),
			resolve: data => data['position']
		},
	    rowId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['row-id']
		},
	    screenId: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: data => data['screen-id']
		},
        url: {
            type: GraphQLString,
            resolve: data => data['url']
        },
	    verticalAlignment: {
			type: new GraphQLNonNull(VerticalAlignment),
			resolve: data => (data['alignment'] || {})['vertical']
		},
	    width: {
			type: Length,
			resolve: data => data['width']
		},
        customKeys: {
            type: new GraphQLNonNull(GraphQLJSON),
			resolve: data => data['custom-keys']
        }
	})
})
export default Experience

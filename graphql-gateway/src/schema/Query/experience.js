import request from 'request'
import { URL } from 'url'

import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import Experience from '../Experience'

const experience = {
    type: Experience,
    args: {
        id: {
            type: GraphQLID
        },
        campaignID: {
            type: GraphQLID
        },
        campaignURL: {
            type: GraphQLString
        }
    },
    resolve: (_, { id: experienceID, campaignID, campaignURL }, { accountToken }) => {
        if (experienceID !== null && experienceID !== undefined) {
            return fetchExperience(experienceID, accountToken)
        } else if (campaignID !== null && campaignID !== undefined) {
            return fetchExperience("57b32c299514ac00271a7425", accountToken).then(experience => ({
                ...experience,
                campaignID
            }))
        } else if (campaignURL !== null && campaignURL !== undefined) {
            let shortURL = new URL(campaignURL).pathname.replace('/', '')
            return fetchExperience(shortURL, accountToken).then(experience => ({
                ...experience,
                campaignID: shortURL
            }))
        } else {
            throw new TypeError('Field "experience" argument "id" of type "ID" or argument "campaignID" of type "String" or argument "campaignURL" of type "String" is required but neither were provided.')
        }
    }
}

const fetchExperience = (identifier, accountToken) => {
    return new Promise((resolve, reject) => {
        let baseUrl = 'https://api.rover.io'
        const host = process.env.CONTENT_API_SERVICE_SERVICE_HOST
        const port = process.env.CONTENT_API_SERVICE_SERVICE_PORT
        if (host && port) {
            baseUrl = `http://${host}:${port}`
        }

        const options = {
            url: `${baseUrl}/v1/experiences/${identifier}/current`,
            headers: {
                accept: 'application/json',
                'x-rover-api-key': accountToken
            }
        }

        request(options, (err, response, body) => {
            const error = err || errorFromResponse(response)
            if (error) {
                return reject(error)
            }

            try {
                const json = JSON.parse(body)
                const data = json['data']
                if (data === null || data === undefined) {
                    return null
                }

                const attributes = data['attributes']

                if (attributes === null || attributes === undefined) {
                    return null
                }

                const experience = normalizeExperience({
                    id: data['id'],
                    ...attributes
                })
                
                resolve(experience)
            } catch (err) {
                reject(err)
            }
        })
    })
}

const normalizeExperience = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        id: data['id'],
        homeScreenID: data['home-screen-id'],
        screens: normalizeScreens(data['screens']),
        keys: normalizeKeys(data['custom-keys']),
        tags: []
    }
}

const normalizeScreens = data => {
    if (Array.isArray(data)) {
        return data.map(normalizeScreen)
    }

    return []
}

const normalizeScreen = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        background: normalizeBackground(data),
        id: data['id'],
        isStretchyHeaderEnabled: normalizeBoolean(data['is-stretchy-header-enabled'], true),
        rows: normalizeRows(data['rows']),
        statusBar: {
            style: normalizeStatusBarStyle(data['status-bar-style']),
            color: normalizeColor(data['status-bar-color'])
        },
        titleBar: {
            backgroundColor: normalizeColor(data['title-bar-background-color']),
            buttons: normalizeTitleBarButtons(data['title-bar-buttons']),
            buttonColor: normalizeColor(data['title-bar-button-color']),
            text: data['title'],
            textColor: normalizeColor(data['title-bar-text-color']),
            useDefaultStyle: normalizeBoolean(data['use-default-title-bar-style'], false)
        },
        keys: normalizeKeys(data['custom-keys']),
        tags: []
    }
}

const normalizeBackground = data => {
    return {
        color: normalizeColor(data['background-color']),
        contentMode: normalizeBackgroundContentMode(data['background-content-mode']),
        image: normalizeImage(data['background-image']),
        scale: normalizeInteger(data['background-scale'], 1)
    }
}

const normalizeTitleBarButtons = data => {
    switch (data) {
        case 'close':
        case 'back':
        case 'both':
            return data
        default:
            return 'close'
    }
}

const normalizeColor = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        red: normalizeNumber(data['red'], 0.0),
        green: normalizeNumber(data['green'], 0.0),
        blue: normalizeNumber(data['blue'], 0.0),
        alpha: normalizeNumber(data['alpha'], 1.0)
    }
}

const normalizeNumber = (data, fallback) => {
    if (isNaN(data)) {
        console.log('NaN', data, fallback)
        return fallback
    }

    return data
}

const normalizeBackgroundContentMode = data => {
    switch (data) {
        case 'original':
        case 'stretch':
        case 'tile':
        case 'fill':
        case 'fit':
            return data
        default:
            return 'original'
    }
}

const normalizeImage = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        height: normalizeInteger(data['height'], 0),
        isURLOptimizationEnabled: normalizeBoolean(data['is-url-optimization-enabled'], true),
        name: data['name'],
        size: normalizeInteger(data['size'], 0),
        width: normalizeInteger(data['width'], 0),
        url: data['url']
    }
}

const normalizeInteger = (data, fallback) => {
    if (Number.isInteger(data)) {
        return data
    }

    return fallback
}

const normalizeBoolean = (data, fallback) => {
    if (typeof data === 'boolean') {
        return data
    }

    return fallback
}

const normalizeStatusBarStyle = data => {
    switch (data) {
        case 'light':
        case 'dark':
            return data
        default:
            return 'light'
    }
}

const normalizeRows = data => {
    if (Array.isArray(data)) {
        return data.map(normalizeRow)
    }

    return []
}

const normalizeRow = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        background: normalizeBackground(data),
        blocks: normalizeBlocks(data['blocks']),
        height: normalizeHeight(data),
        id: data['id'],
        keys: normalizeKeys(data['custom-keys']),
        tags: []
    }
}

const normalizeHeight = data => {
    if (data === null || data === undefined) {
        return {
            __typename: 'HeightStatic',
            value: 0
        }
    }

    let autoHeight = normalizeBoolean(data['auto-height'], false)
    if (autoHeight) {
        return {
            __typename: 'HeightIntrinsic'
        }
    }

    let length = normalizeLength(data['height'])
    return {
        __typename: 'HeightStatic',
        value: length.value
    }
}

const normalizeLength = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        unit: normalizeUnit(data['unit']),
        value: normalizeNumber(data['value'], 0.0)
    }
}

const normalizeUnit = data => {
    switch (data) {
        case 'points':
        case 'percentage':
            return data
        default:
            return 'points'
    }
}

const normalizeBlocks = data => {
    if (Array.isArray(data)) {
        return data.map(data => {
            if (data === null || data === undefined) {
                return null
            }

            if (data['barcode-scale']) {
                return normalizeBarcodeBlock(data)
            }

            if (data['states']) {
                return normalizeButtonBlock(data)
            }

            if (data['image']) {
                return normalizeImageBlock(data)
            }

            if (data['text']) {
                return normalizeTextBlock(data)
            }

            if (typeof data['scrollable'] !== 'undefined') {
                return normalizeWebViewBlock(data)
            }

            return normalizeRectangleBlock(data)
        })
    }

    return []
}

const normalizeBorder = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        color: normalizeColor(data['border-color']),
        radius: normalizeInteger(data['border-radius'], 0),
        width: normalizeInteger(data['border-width'], 0)
    }
}

const normalizeBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    const action = (data => {
        if (data === null || data === undefined) {
            return null
        }

        const url = data['url']
        if (typeof url === 'string') {
            return {
                __typename: 'OpenURLAction',
                url
            }
        }
    
        const screenID = data['screen-id']
        if (typeof screenID === 'string') {
            return {
                __typename: 'GoToScreenAction',
                screenID
            }
        }
    
        return null
    })(data['action'])

    const insets = (data => {
        if (data === null || data === undefined) {
            return {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0
            }
        }
    
        return {
            bottom: normalizeInteger(data['bottom'], 0),
            left: normalizeInteger(data['left'], 0),
            right: normalizeInteger(data['right'], 0),
            top: normalizeInteger(data['top'], 0)
        }
    })(data['inset'])

    const { bottom, center, left, middle, right, top } = (data => {
        if (data === null || data === undefined) {
            return {
                bottom: 0,
                center: 0,
                left: 0,
                middle: 0,
                right: 0,
                top: 0
            }
        }

        return {
            bottom: normalizeLength(data['bottom']).value,
            center: normalizeLength(data['center']).value,
            left: normalizeLength(data['left']).value,
            middle: normalizeLength(data['middle']).value,
            right: normalizeLength(data['right']).value,
            top: normalizeLength(data['top']).value
        }
    })(data['offset'])

    const { horizontal, vertical } = (data => {
        if (data === null || data === undefined) {
            return {
                horizontal: 'left',
                vertical: 'top'
            }
        }

        return {
            horizontal: data['horizontal'] || 'top',
            vertical: data['vertical'] || 'left'
        }
    })(data['alignment'])

    const horizontalAlignment = (() => {
        const width = normalizeLength(data['width']).value
        switch (horizontal) {    
            case 'right':
                return {
                    __typename: 'HorizontalAlignmentRight',
                    offset: right,
                    width
                }
            case 'center': 
                return {
                    __typename: 'HorizontalAlignmentCenter',
                    offset: center,
                    width
                }
            case 'fill':
                return {
                    __typename: 'HorizontalAlignmentFill',
                    leftOffset: left,
                    rightOffset: right
                }
            default:
                return {
                    __typename: 'HorizontalAlignmentLeft',
                    offset: left,
                    width
                }
        }
    })()
    
    const verticalAlignment = (() => {
        const height = (() => {
            const autoHeight = normalizeBoolean(data['auto-height'], false)
            if (autoHeight) {
                return {
                    __typename: 'HeightIntrinsic'
                }
            }
    
            return {
                __typename: 'HeightStatic',
                value: normalizeLength(data['height']).value
            }
        })() 

        const isStacked = data['position'] === 'stacked'

        if (isStacked) {
            return {
                __typename: 'VerticalAlignmentStacked',
                topOffset: top,
                bottomOffset: bottom,
                height
            }
        }

        switch (vertical) {
            case 'bottom':
                return {
                    __typename: 'VerticalAlignmentBottom',
                    offset: bottom,
                    height
                }
            case 'middle':
                return {
                    __typename: 'VerticalAlignmentMiddle',
                    offset: middle,
                    height
                }
            case 'fill':
                return {
                    __typename: 'VerticalAlignmentFill',
                    topOffset: top,
                    bottomOffset: bottom
                }
            default:
                return {
                    __typename: 'VerticalAlignmentTop',
                    offset: top,
                    height
                }
        }
    })

    return {
        action,
        id: data['id'],
        insets,   
        opacity: normalizeNumber(data['opacity'], 1.0),
        position: {
            horizontalAlignment,
            verticalAlignment,
        },
        keys: normalizeKeys(data['custom-keys']),
        tags: []
    }
}

const normalizeBarcodeBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'BarcodeBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data),
        border: normalizeBorder(data),
        barcode: {
            scale: normalizeInteger(data['barcode-scale'], 1),
            text: data['barcode-text'],
            format: normalizeBarcodeFormat(data['barcode-type'])
        }
    }
}

const normalizeBarcodeFormat = data => {
    switch (data) {
        case 'qrcode':
        case 'azteccode':
        case 'hibcpdf417':
        case 'code128':
            return data
        default:
            return 'hibcpdf417'
    }
}

const normalizeButtonBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'ButtonBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data['states']['normal']),
        border: normalizeBorder(data['states']['normal']),
        text: normalizeText(data['states']['normal'])
    }
}

const normalizeImageBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'ImageBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data),
        border: normalizeBorder(data),
        image: normalizeImage(data['image'])
    }
}

const normalizeTextBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'TextBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data),
        border: normalizeBorder(data),
        text: normalizeText(data)
    }
}

const normalizeText = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        rawValue: data['text'],
        alignment: normalizeTextAlignment(data['text-alignment']),
        color: normalizeColor(data['text-color']),
        font: normalizeFont(data['text-font'])
    }
}

const normalizeTextAlignment = data => {
    switch (data) {
        case 'left':
        case 'right':
        case 'center':
            return data
        default:
            return 'left'
    }
}

const normalizeFont = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        size: normalizeInteger(data['size'], 15),
        weight: normalizeFontWeight(data['weight'])
    }
}

const normalizeFontWeight = data => {
    switch (data) {
        case 100:
        case 200:
        case 300:
        case 400:
        case 500:
        case 600:
        case 700:
        case 800:
        case 900:
            return data
        default:
            return 400
    }
}

const normalizeWebViewBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'WebViewBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data),
        border: normalizeBorder(data),
        webView: {
            isScrollingEnabled: normalizeBoolean(data['scrollable'], true),
            url: data['url']
        }
    }
}

const normalizeRectangleBlock = data => {
    if (data === null || data === undefined) {
        return null
    }

    return {
        __typename: 'RectangleBlock',
        ...normalizeBlock(data),
        background: normalizeBackground(data),
        border: normalizeBorder(data)
    }
}

const normalizeKeys = data => {
    if (typeof data === 'object') {
        return data
    }

    return {}
}

const errorFromResponse = response => {
    if (!response) {
        return new Error('Failed To Connect')
    }

    switch (response.statusCode) {
    case 300:
        return new Error('Multiple Choices')
    case 301:
        return new Error('Moved Permanently')
    case 302:
        return new Error('Found')
    case 303:
        return new Error('See Other')
    case 304:
        return new Error('Not Modified')
    case 305:
        return new Error('Use Proxy')
    case 307:
        return new Error('Temporary Redirect')
    case 308:
        return new Error('Permanent Redirect')
    case 400:
        return new Error('Bad Request')
    case 401:
        return new Error('Unauthorized')
    case 402:
        return new Error('Payment Required')
    case 403:
        return new Error('Forbidden')
    case 404:
        return new Error('Not Found')
    case 405:
        return new Error('Method Not Allowed')
    case 406:
        return new Error('Not Acceptable')
    case 407:
        return new Error('Proxy Authentication Required')
    case 408:
        return new Error('Request Timeout')
    case 409:
        return new Error('Conflict')
    case 410:
        return new Error('Gone')
    case 411:
        return new Error('Length Required')
    case 412:
        return new Error('Precondition Failed')
    case 413:
        return new Error('Payload Too Large')
    case 414:
        return new Error('URI Too Long')
    case 415:
        return new Error('Unsupported Media Type')
    case 416:
        return new Error('Range Not Satisfiable')
    case 417:
        return new Error('Expectation Failed')
    case 421:
        return new Error('Misdirected Request')
    case 422:
        return new Error('Unprocessable Entity')
    case 423:
        return new Error('Locked')
    case 424:
        return new Error('Failed Dependency')
    case 426:
        return new Error('Upgrade Required')
    case 428:
        return new Error('Precondition Required')
    case 429:
        return new Error('Too Many Requests')
    case 431:
        return new Error('Request Header Fields Too Large')
    case 451:
        return new Error('Unavailable For Legal Reasons')
    case 500:
        return new Error('Internal Server Error')
    case 502:
        return new Error('Bad Gateway')
    case 503:
        return new Error('Service Unavailable')
    case 504:
        return new Error('Gateway Timeout')
    case 505:
        return new Error('HTTP Version Not Supported')
    case 506:
        return new Error('Variant Also Negotiates')
    case 507:
        return new Error('Insufficient Storage')
    case 508:
        return new Error('Loop Detected')
    case 510:
        return new Error('Not Extended')
    case 511:
        return new Error('Network Authentication Required')
    default:
        return null
    }
}

export default experience

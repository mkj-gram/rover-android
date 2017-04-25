import request from 'request'
import { GraphQLID, GraphQLNonNull } from 'graphql'
import { ExperienceType } from '../types/ExperienceType'

const ExperienceQuery = {
    type: ExperienceType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve(_, { id }) {
        const options = {
            url: 'https://api.rover.io/v1/experiences/' + id + '/current',
            headers: {
                accept: 'application/json',
                'x-rover-api-key': 'd6ab40e8a45e3040c372806baba387fd'
            }
        }
        
        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                try {
                    const json = JSON.parse(body)
                    const data = json['data']

                    if (!data) {
                        console.log('Missing data key')
                        return null
                    }

                    const attributes = data['attributes']

                    if (!attributes) {
                        console.log('Missing attributes key')
                        return null
                    }

                    const experience = parseExperience({
                        ...attributes,
                        id: data['id']
                    })

                    resolve(experience)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}

const parseExperience = json => {
    if (!json) {
        return null
    }

    return {
        id: json['id'],
        homeScreenId: json['home-screen-id'],
        screens: (json['screens'] || []).map(parseScreen)
    }
}

const parseScreen = json => {
    if (!json) {
        return null
    }

    return {
        autoColorStatusBar: json['status-bar-auto-color'],
        backgroundColor: json['background-color'],
        backgroundImage: parseImage(json['background-image']),
        backgroundContentMode: json['background-content-mode'],
        backgroundScale: json['background-scale'],
        experienceId: json['experience-id'],
        id: json['id'],
        rows: (json['rows'] || []).map(parseRow),
        statusBarStyle: json['status-bar-style'],
        statusBarColor: json['status-bar-color'],
        titleBarBackgroundColor: json['title-bar-background-color'],
        titleBarButtons: json['title-bar-buttons'],
        titleBarButtonColor: json['title-bar-button-color'],
        titleBarText: json['title-bar-text'],
        titleBarTextColor: json['title-bar-text-color'],
        useDefaultTitleBarStyle: json['use-default-title-bar-style']
    }
}

const parseRow = json => {
    if (!json) {
        return null
    }

    return {
        autoHeight: json['auto-height'],
        backgroundColor: json['background-color'],
        backgroundImage: parseImage(json['background-image']),
        backgroundContentMode: json['background-content-mode'],
        backgroundScale: json['background-scale'],
        blocks: (json['blocks'] || []).map(parseBlock),
        experienceId: json['experience-id'],
        height: parseLength(json['height']),
        id: json['id'],
        screenId: json['screen-id']
    }
}

const parseBlock = json => {
    if (!json) {
        return null
    }

    return {
        action: (json['action'] || {})['type'],
        autoHeight: json['auto-height'] || false,
        backgroundColor: json['background-color'] || {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1.0
        },
        backgroundContentMode: json['background-content-mode'],
        backgroundImage: parseImage(json['background-image']),
        backgroundScale: json['background-scale'],
        borderColor: json['border-color'] || {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1.0
        },
        borderRadius: json['border-radius'] || 0,
        borderWidth: json['border-width'] || 0,
        experienceId: json['experience-id'],
        height: parseLength(json['height']),
        id: json['id'],
        horizontalAlignment: (json['alignment'] || {})['horizontal'],
        offset: parseOffset(json['offset']),
        opacity: json['opacity'],
        position: json['position'],
        rowId: json['row-id'],
        screenId: json['screen-id'],
        verticalAlignment: (json['alignment'] || {})['vertical']
    }
}

const parseImage = json => {
    if (!json) {
        return null
    }

    return {
        height: json['height'],
        name: json['name'],
        size: json['size'],
        width: json['width'],
        url: json['url']
    }
}

const parseLength = json => {
    if (!json) {
        return null
    }

    return {
        unit: json['type'],
        value: json['value']
    }
}

const parseOffset = json => {
    if (!json) {
        return null
    }

    return {
        bottom: parseLength(json['bottom']),
        center: parseLength(json['center']),
        left: parseLength(json['left']),
        middle: parseLength(json['middle']),
        right: parseLength(json['right']),
        top: parseLength(json['top'])
    }    
}

export default ExperienceQuery

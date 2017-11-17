import request from 'request'
import { GraphQLID, GraphQLNonNull } from 'graphql'
import Experience from '../models/Experience'
import { requireAuthentication } from '../../resolvers'

const ExperienceQuery = {
    type: Experience,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        campaignId: {
            type: GraphQLID
        }
    },
    resolve: requireAuthentication((_, { id }, { accountToken }) => {
        let baseUrl = 'https://api.rover.io'
        const host = process.env.CONTENT_API_SERVICE_SERVICE_HOST
        const port = process.env.CONTENT_API_SERVICE_SERVICE_PORT
        if (host && port) {
            baseUrl = `http://${host}:${port}`
        }

        const options = {
            url: `${baseUrl}/v1/experiences/${id}/current`,
            headers: {
                accept: 'application/json',
                'x-rover-api-key': accountToken
            }
        }

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                const error = err || errorFromResponse(response)
                if (error) {
                    return reject(error)
                }

                try {
                    const json = JSON.parse(body)
                    const data = json['data']

                    if (!data) {
                        return null
                    }

                    const attributes = data['attributes']

                    if (!attributes) {
                        return null
                    }

                    resolve({
                        ...attributes,
                        id: data['id']
                    })
                } catch (err) {
                    reject(err)
                }
            })
        })
    })
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

export default ExperienceQuery

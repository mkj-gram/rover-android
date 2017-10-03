import request from 'request'
import { GraphQLID, GraphQLNonNull } from 'graphql'
import Experience from '../models/Experience'

const ExperienceQuery = {
    type: Experience,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolve(_, { id }, { apiKey }) {
        const host = process.env.CONTENT_API_SERVICE_SERVICE_HOST || 'https://api.rover.io'
        const options = {
            url: `${host}/v1/experiences/${id}/current`,
            headers: {
                accept: 'application/json',
                'x-rover-api-key': apiKey
            }
        }

        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (response.statusCode === 404) {
                    let error = new Error('No experience found with id: ' + id)
                    return reject(error)
                }

                if (response.statusCode !== 200) {
                    let error = new Error('Failed to retrieve experience with id: ' + id)
                    return reject(error)
                }

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

                    resolve({
                        ...attributes,
                        id: data['id']
                    })
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}

export default ExperienceQuery

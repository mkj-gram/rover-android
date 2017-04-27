import request from 'request'
import { GraphQLID, GraphQLNonNull } from 'graphql'
import EditableExperience from './EditableExperience'

const EditableExperienceQuery = {
    type: EditableExperience.type,
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

                    const experience = EditableExperience.fromJSON({
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

export default EditableExperienceQuery

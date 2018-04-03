import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../Event'
import { requireAuthentication } from '../../resolvers'
import { Constants } from '@rover/events-pipeline-client'

const trackEvents = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    },
    resolve: requireAuthentication(async (_, { events }, { clients, authContext, deviceIdentifier }) => {
        const transformer = clients.transformer

        for (let i = 0; i < events.length; i++) {
            const event = events[i]

            try {
                await transformer.submit(authContext, deviceIdentifier, Constants.DEVICE_EVENT, event)
            } catch(err) {
                throw new Error(`Failed to submit events[${i}]: ${err}`)
            }
        }
        
        return 'success'
    })
}

export default trackEvents

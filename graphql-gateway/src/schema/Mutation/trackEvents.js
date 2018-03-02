import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../Event'
import { requireAuthentication } from '../../resolvers'
import { Constants } from '@rover/transformer-client'

const trackEvents = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    },
    resolve: requireAuthentication(async (_, { events }, { clients, authContext, deviceIdentifier }) => {
        const transformer = clients.transformer

        events.forEach(async(event, index) => {
            try {
                await transformer.submit(authContext, deviceIdentifier, Constants.DEVICE_EVENT, event)
            } catch(err) {
                throw new Error(`Failed to submit events[${index}]: ${err}`)
            }
        })
        
        return 'success'
    })
}

export default trackEvents

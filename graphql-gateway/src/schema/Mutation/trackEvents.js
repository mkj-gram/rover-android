import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../Event'
import { requireAuthentication } from '../../resolvers'
import { Constants } from '@rover/events-pipeline-client'
import ParseIp from '@rover-common/ip-parse'

const trackEvents = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    },
    resolve: requireAuthentication(async (_, { events }, { headers, clients, authContext, deviceIdentifier }) => {
        const transformer = clients.transformer

        for (let i = 0; i < events.length; i++) {
            const event = events[i]

            if (event.context && headers['x-real-ip']) {
                event.context.ip = ParseIp(headers['x-real-ip'])
            }

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

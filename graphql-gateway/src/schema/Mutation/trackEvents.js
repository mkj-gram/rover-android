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
    resolve: requireAuthentication(async (_, { events }, { headers, clients, authContext }) => {
        const pipeline = clients.pipeline

        for (let i = 0; i < events.length; i++) {
            const event = events[i]
            const { device } = event

            // TODO: Add support for non-device events. For now, no-op if the event doesn't have an associated DeviceContext.
            if (!device) { continue }

            if (headers['x-real-ip']) {
                device.ip = ParseIp(headers['x-real-ip'])
            }

            // TODO: Rename appNamespace to appIdentifier throughout the rest of the stack.
            device.appNamespace = device.appIdentifier  
            
            // TODO: Once support we support non-device events use a paritition key that makes sense for the event
            // ie. If its a server to server call with a profile identifier we should key the event by profile identifier
            const { deviceIdentifier } = device

            try {
                await pipeline.submit(authContext, deviceIdentifier, event)
            } catch(err) {
                throw new Error(`Failed to submit events[${i}]: ${err}`)
            }
        }
        
        return 'success'
    })
}

export default trackEvents

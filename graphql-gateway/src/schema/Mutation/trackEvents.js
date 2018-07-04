import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../Event'
import ParseIp from '@rover-common/ip-parse'

const trackEvents = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    },
    resolve: async (_, { events }, { headers, clients, authContext }) => {
        const pipeline = clients.pipeline
        
        const batch = events.filter(event => {
            const { device } = event
            // TODO: Once support we support non-device events use a paritition key that makes sense for the event
            // ie. If its a server to server call with a profile identifier we should key the event by profile identifier
            return device !== null
        }).map(event => {
            const { device } = event
            if (headers['x-real-ip']) {
                device.ip = ParseIp(headers['x-real-ip'])
            }

            // TODO: Rename appNamespace to appIdentifier throughout the rest of the stack.
            device.appNamespace = device.appIdentifier  
            
            const { deviceIdentifier } = device
            return {auth: authContext, key: deviceIdentifier, event: event}
        })

        try {
            await pipeline.submitBatch(batch)
        } catch (err) {
            // TODO if client needs to know which message failed propagate error from pipeline client
            throw new Error(`Failed to submit events`)
        }
        
        return 'success'
    }
}

export default trackEvents

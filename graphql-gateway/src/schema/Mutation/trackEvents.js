import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../Event'
import { requireAuthentication } from '../../resolvers'

const trackEvents = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        }
    },
    resolve: requireAuthentication((_, { events }) => {
        return 'success'
    })
}

export default trackEvents

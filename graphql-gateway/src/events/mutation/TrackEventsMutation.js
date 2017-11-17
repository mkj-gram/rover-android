import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Event from '../models/Event'
import { requireAuthentication } from '../../resolvers'

const TrackEventsMutation = {
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

export default TrackEventsMutation

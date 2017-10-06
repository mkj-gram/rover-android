import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import Context from '../models/Context'
import Event from '../models/Event'
import { requireAuthentication } from '../../resolvers'

const TrackEventsMutation = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLNonNull(new GraphQLList(Event))
        },
        context: {
            type: new GraphQLNonNull(Context)
        }
    },
    resolve: requireAuthentication((_, { events }) => {
        return 'success'
    })
}

export default TrackEventsMutation

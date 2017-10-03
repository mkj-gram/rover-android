import { GraphQLList, GraphQLString } from 'graphql'
import Event from '../models/Event'

const TrackEventsMutation = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLList(Event)
        }
    },
    resolve(_, { events }) {
        return 'success'
    }
}

export default TrackEventsMutation

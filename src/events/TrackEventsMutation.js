import { GraphQLList, GraphQLString } from 'graphql'
import EventInputType from './EventInputType'

const TrackEventsMutation = {
    type: GraphQLString,
    args: {
        events: {
            type: new GraphQLList(EventInputType)
        }
    },
    resolve(_, { events }) {
        return 'success'
    }
}

export default TrackEventsMutation

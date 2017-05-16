import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../events/TrackEventsMutation'
import SegmentMutation from '../segments/SegmentMutation'
import { campaignMutations } from '../campaigns/CampaignTypes'

class Mutation { }

Mutation.type = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: TrackEventsMutation,
        ...campaignMutations,
        ...SegmentMutation,
    }
})

export default Mutation

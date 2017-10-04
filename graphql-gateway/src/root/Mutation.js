import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../events/mutation/TrackEventsMutation'
import SegmentMutation from '../segments/SegmentMutation'
import { campaignMutations } from '../campaigns/CampaignTypes'
import UpdateTestDeviceMutation from '../segments/UpdateTestDeviceMutation'

class Mutation { }

Mutation.type = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: TrackEventsMutation,
        ...campaignMutations,
        ...SegmentMutation,
        ...UpdateTestDeviceMutation
    }
})

export default Mutation

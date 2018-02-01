import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../events/mutation/TrackEventsMutation'
import SegmentMutation from '../segments/SegmentMutation'
import UpdateTestDeviceMutation from '../segments/UpdateTestDeviceMutation'
import CreateCampaignMutation from '../campaigns/mutations/CreateCampaignMutation'

class Mutation {}

Mutation.type = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createCampaign: CreateCampaignMutation,
        trackEvents: TrackEventsMutation,
        ...SegmentMutation,
        ...UpdateTestDeviceMutation
    }
})

export default Mutation

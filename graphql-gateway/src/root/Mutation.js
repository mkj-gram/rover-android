import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../events/mutation/TrackEventsMutation'
import SegmentMutation from '../segments/SegmentMutation'
import UpdateTestDeviceMutation from '../segments/UpdateTestDeviceMutation'
import CreateCampaignMutation from '../campaigns/mutations/CreateCampaignMutation'
import RenameCampaignMutation from '../campaigns/mutations/RenameCampaignMutation'
import DuplicateCampaignMutation from '../campaigns/mutations/DuplicateCampaignMutation'
import ArchiveCampaignMutation from '../campaigns/mutations/ArchiveCampaignMutation'

class Mutation {}

Mutation.type = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createCampaign: CreateCampaignMutation,
        renameCampaign: RenameCampaignMutation,
        duplicateCampaign: DuplicateCampaignMutation,
        archiveCampaign: ArchiveCampaignMutation,
        trackEvents: TrackEventsMutation,
        ...SegmentMutation,
        ...UpdateTestDeviceMutation
    }
})

export default Mutation

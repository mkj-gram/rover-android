import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../operations/TrackEventsMutation'
import { campaignMutations } from './CampaignTypes'

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: TrackEventsMutation,
        ...campaignMutations
    }   
})

export default MutationType

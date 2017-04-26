import { GraphQLObjectType } from 'graphql'
import TrackEventsMutation from '../events/TrackEventsMutation'
import { campaignMutations } from '../campaigns/CampaignTypes'

class Mutation { }

Mutation.type = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: TrackEventsMutation,
        ...campaignMutations
    }   
})

export default Mutation

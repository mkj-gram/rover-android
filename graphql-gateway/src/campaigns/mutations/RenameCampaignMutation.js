import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'

const RenameCampaignMutation = {
    type: GraphQLBoolean,
    description: 'Rename a Campaign',
    args: {
        name: { type: GraphQLString },
        campaignId: { type: GraphQLInt }
    },
    resolve: async (_, { name, campaignId }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.RenameRequest()
        request.setAuthContext(authContext)
        request.setName(name)
        request.setCampaignId(campaignId)

        const response = await campaignsClient.rename(request)

        return true
    }
}

export default RenameCampaignMutation

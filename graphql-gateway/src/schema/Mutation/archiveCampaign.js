import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLInt, GraphQLBoolean } from 'graphql'

const archiveCampaign = {
    type: GraphQLBoolean,
    description: 'Archive a Campaign',
    args: {
        campaignId: { type: GraphQLInt }
    },
    resolve: async (_, { campaignId }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.ArchiveRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)

        const response = await campaignsClient.archive(request)

        return true
    }
}

export default archiveCampaign

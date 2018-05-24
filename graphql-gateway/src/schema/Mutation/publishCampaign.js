import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLBoolean, GraphQLInt } from 'graphql'

const publishCampaign = {
    type: GraphQLBoolean,
    description: 'Publish a Campaign',
    args: {
        campaignId: { type: GraphQLInt }
    },
    resolve: async (_, { campaignId }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.PublishRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)

        const response = await campaignsClient.publish(request)
        return true
    }
}

export default publishCampaign

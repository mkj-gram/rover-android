import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql'

const sendTestCampaign = {
    type: GraphQLBoolean,
    description: 'Send Campaign to devices marked as test devices',
    args: {
        campaignId: { type: GraphQLInt },
        deviceIds: { type: new GraphQLList(GraphQLString) }
    },
    resolve: async (_, { campaignId, deviceIds }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.SendTestRequest()

        request.setAuthContext(authContext)

        request.setCampaignId(campaignId)

        request.setDeviceIdsList(deviceIds)

        const response = await campaignsClient.sendTest(request)

        return true
    }
}

export default sendTestCampaign

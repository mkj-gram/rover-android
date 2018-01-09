import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLString } from 'graphql'

import { campaign } from '../interfaces'
import getAutomatedNotificationCampaignFromProto from '../../grpc/campaigns/getAutomatedNotificationCampaignFromProto'
import getScheduledNotificationCampaignFromProto from '../../grpc/campaigns/getScheduledNotificationCampaignFromProto'

const CreateCampaignMutation = {
    type: campaign,
    description: 'Create a new Campaign',
    args: {
        name: { type: GraphQLString },
        campaignType: { type: GraphQLString }
    },
    resolve: async (_, { campaignType, name }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.CreateRequest()
        request.setAuthContext(authContext)
        request.setName(name)
        request.setCampaignType(1)
        const response = await campaignsClient.create(request)

        const campaign = response.getCampaign()
        let res
        if (campaign.hasScheduledNotificationCampaign()) {
            res = getScheduledNotificationCampaignFromProto(
                campaign.getScheduledNotificationCampaign()
            )
        }
        if (campaign.hasAutomatedNotificationCampaign()) {
            res = getAutomatedNotificationCampaignFromProto(
                campaign.getAutomatedNotificationCampaign()
            )
        }

        return res
    }
}

export default CreateCampaignMutation

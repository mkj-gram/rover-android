import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLString, GraphQLInt } from 'graphql'

import Campaign from '../Campaign'
import getAutomatedNotificationCampaignFromProto from '../../grpc/campaigns/getAutomatedNotificationCampaignFromProto'
import getScheduledNotificationCampaignFromProto from '../../grpc/campaigns/getScheduledNotificationCampaignFromProto'

const duplicateCampaign = {
    type: Campaign,
    description: 'Duplicate a Campaign',
    args: {
        name: { type: GraphQLString },
        campaignId: { type: GraphQLInt }
    },
    resolve: async (_, { campaignId, name }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.DuplicateRequest()
        request.setAuthContext(authContext)
        request.setName(name)
        request.setCampaignId(campaignId)
        const response = await campaignsClient.duplicate(request)

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

export default duplicateCampaign

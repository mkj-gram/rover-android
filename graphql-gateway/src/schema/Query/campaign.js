import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLInt } from 'graphql'

import Campaign from '../Campaign'

import {
    getAutomatedNotificationCampaignFromProto,
    getScheduledNotificationCampaignFromProto
} from '../../grpc/campaigns'

const campaign = {
    type: Campaign,
    description: 'Get a campaign',
    args: {
        campaignId: { type: GraphQLInt }
    },
    resolve: async (_, { campaignId }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.GetRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)

        const response = await campaignsClient.get(request)
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

export default campaign

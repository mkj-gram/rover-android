import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import { GraphQLString } from 'graphql'

import { Campaign } from '../interfaces'
import {
    getAutomatedNotificationCampaignFromProto,
    getScheduledNotificationCampaignFromProto
} from '../../grpc/campaigns'

const CreateCampaignMutation = {
    type: Campaign,
    description: 'Create a new Campaign',
    args: {
        name: { type: GraphQLString },
        campaignType: { type: GraphQLString }
    },
    resolve: async (_, { campaignType, name }, { authContext }) => {
        const request = new RoverApis.campaigns.v1.Models.CreateRequest()
        request.setAuthContext(authContext)
        request.setName(name)
        request.setCampaignType(2)
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

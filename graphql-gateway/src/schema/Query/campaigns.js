import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import {
    getScheduledNotificationCampaignFromProto,
    getAutomatedNotificationCampaignFromProto
} from '../../grpc/campaigns'

import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import Campaign from '../Campaign'

const campaigns = {
    type: new GraphQLNonNull(new GraphQLList(Campaign)),
    args: {
        campaignStatus: { type: GraphQLString },
        campaignType: { type: GraphQLString },
        keyword: { type: GraphQLString },
        pageNumber: { type: GraphQLInt },
        pageSize: { type: GraphQLInt }
    },
    resolve: async (
        _,
        { campaignStatus, campaignType, keyword, pageNumber, pageSize },
        { authContext }
    ) => {
        const Models = RoverApis.campaigns.v1.Models
        const request = new RoverApis.campaigns.v1.Models.ListRequest()
        request.setAuthContext(authContext)
        request.setCampaignStatus(Models.CampaignStatus.Enum[campaignStatus])
        request.setCampaignType(Models.CampaignType.Enum[campaignType])
        request.setKeyword(keyword)
        request.setPage(pageNumber)
        request.setPageSize(50)

        const response = await campaignsClient.list(request)
        return response.getCampaignsList().map(campaign => {
            if (campaign.hasAutomatedNotificationCampaign())
                return getAutomatedNotificationCampaignFromProto(
                    campaign.getAutomatedNotificationCampaign()
                )
            if (campaign.hasScheduledNotificationCampaign())
                return getScheduledNotificationCampaignFromProto(
                    campaign.getScheduledNotificationCampaign()
                )
        })
    }
}

export default campaigns

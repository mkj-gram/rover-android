import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../grpcClients'
promisify(campaignsClient)

import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

import { Campaign } from './interfaces'
import {
    getScheduledNotificationCampaignFromProto,
    getAutomatedNotificationCampaignFromProto
} from '../grpc/campaigns'

const CampaignsQuery = {
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
        console.log('we in ??')
        const request = new RoverApis.campaigns.v1.Models.ListRequest()
        request.setAuthContext(authContext)
        request.setCampaignStatus()
        request.setCampaignType()
        request.setKeyword()
        request.setPage()
        request.setPageSize()
        console.log('we fget here')
        const response = await campaignsClient.list(request)
        console.log('in here?')
        console.log(response)
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

export default CampaignsQuery

import RoverApis, { Helpers } from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'

import Campaign, { ScheduledType, SegmentCondition } from '../Campaign'

import { getScheduledNotificationCampaignFromProto } from '../../grpc/campaigns'

const updateScheduledDeliverySettings = {
    type: Campaign,
    description: 'Update Scheduled Delivery Settings',
    args: {
        campaignId: { type: GraphQLInt },
        scheduledTimestamp: { type: GraphQLDateTime },
        scheduledTimeZone: { type: GraphQLString },
        scheduledType: { type: ScheduledType },
        scheduledUseLocalDeviceTime: { type: GraphQLBoolean },
        segmentCondition: { type: SegmentCondition },
        segmentIds: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLString))
            )
        },
        UIState: { type: GraphQLString }
    },
    resolve: async (
        _,
        {
            campaignId,
            scheduledTimestamp,
            scheduledTimeZone,
            scheduledType,
            scheduledUseLocalDeviceTime,
            segmentCondition,
            segmentIds,
            UIState
        },
        { authContext }
    ) => {
        const request = new RoverApis.campaigns.v1.Models.UpdateScheduledDeliverySettingsRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)

        request.setScheduledTimestamp(
            Helpers.timestampToProto(scheduledTimestamp)
        )
        request.setScheduledTimeZone(scheduledTimeZone)
        request.setScheduledUseLocalDeviceTime(scheduledUseLocalDeviceTime)
        request.setScheduledType(scheduledType === 'NOW' ? 0 : 1)

        request.setSegmentCondition(segmentCondition === 'ANY' ? 0 : 1)
        request.setSegmentIdsList(segmentIds)

        request.setUiState(UIState)

        const response = await campaignsClient.updateScheduledDeliverySettings(
            request
        )

        return getScheduledNotificationCampaignFromProto(
            response.getCampaign().getScheduledNotificationCampaign()
        )
    }
}

export default updateScheduledDeliverySettings

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
        scheduledDate: {
            type: GraphQLDateTime
        },
        scheduledTime: { type: GraphQLInt },
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
            scheduledDate,
            scheduledTime,
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
        const dateValue = new RoverApis.campaigns.v1.Models.Date()
        const timeValue = new RoverApis.protobuf.Models.Int32Value()

        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)
        const dateScheduledTime = new Date(scheduledDate)
        dateValue.setDay(dateScheduledTime.getDate())
        dateValue.setMonth(dateScheduledTime.getMonth() + 1)
        dateValue.setYear(dateScheduledTime.getFullYear())
        request.setScheduledDate(dateValue)

        timeValue.setValue(scheduledTime)
        request.setScheduledTime(timeValue)

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

import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { campaignsClient } from '../../grpcClients'
promisify(campaignsClient)

import GraphQLJSON from 'graphql-type-json'
import { GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql'
import { NotificationAttachmentInput } from '../Notification'
import Campaign from '../Campaign'

import {
    getAutomatedNotificationCampaignFromProto,
    getScheduledNotificationCampaignFromProto
} from '../../grpc/campaigns'

const updateNotificationSettings = {
    type: Campaign,
    description: 'Update Notification Settings',
    args: {
        campaignId: {
            type: GraphQLInt
        },
        experienceId: {
            type: GraphQLString
        },
        UIState: {
            type: GraphQLString
        },
        notificationBody: {
            type: GraphQLString
        },
        notificationTitle: {
            type: GraphQLString
        },
        notificationAttachment: {
            type: NotificationAttachmentInput
        },
        notificationTapBehaviorType: {
            type: GraphQLString
        },
        notificationTapPresentationType: {
            type: GraphQLString
        },
        notificationTapBehaviorUrl: {
            type: GraphQLString
        },
        notificationIosContentAvailable: {
            type: GraphQLBoolean
        },
        notificationIosMutableContent: {
            type: GraphQLBoolean
        },
        notificationIosSound: {
            type: GraphQLString
        },
        notificationIosCategoryIdentifier: {
            type: GraphQLString
        },
        notificationIosThreadIdentifier: {
            type: GraphQLString
        },
        notificationAndroidChannelId: {
            type: GraphQLString
        },
        notificationAndroidSound: {
            type: GraphQLString
        },
        notificationAndroidTag: {
            type: GraphQLString
        },
        notificationExpiration: {
            type: GraphQLInt
        },
        notificationAttributesMap: {
            type: GraphQLJSON
        },
        notificationAlertOptionPushNotification: {
            type: GraphQLBoolean
        },
        notificationAlertOptionNotificationCenter: {
            type: GraphQLBoolean
        },
        notificationAlertOptionBadgeNumber: {
            type: GraphQLBoolean
        }
    },
    resolve: async (
        _,
        {
            campaignId,
            experienceId,
            UIState,
            notificationBody,
            notificationTitle,
            notificationAttachment,
            notificationTapBehaviorType,
            notificationTapPresentationType,
            notificationTapBehaviorUrl,
            notificationIosContentAvailable,
            notificationIosMutableContent,
            notificationIosSound,
            notificationIosCategoryIdentifier,
            notificationIosThreadIdentifier,
            notificationAndroidChannelId,
            notificationAndroidSound,
            notificationAndroidTag,
            notificationExpiration,
            notificationAttributesMap,
            notificationAlertOptionPushNotification,
            notificationAlertOptionNotificationCenter,
            notificationAlertOptionBadgeNumber
        },
        { authContext }
    ) => {
        const request = new RoverApis.campaigns.v1.Models.UpdateNotificationSettingsRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)
        request.setExperienceId(experienceId)
        request.setUiState(UIState)
        request.setNotificationBody(notificationBody)
        request.setNotificationTitle(notificationTitle)

        if (notificationAttachment !== null) {
            request.setNotificationAttachmentType(notificationAttachment.type)
            request.setNotificationAttachmentUrl(notificationAttachment.url)
        }

        request.setNotificationTapBehaviorType(
            RoverApis.campaigns.v1.Models.NotificationTapBehaviorType.Enum[
                notificationTapBehaviorType
            ]
        )
        request.setNotificationTapBehaviorPresentationType(
            RoverApis.campaigns.v1.Models.NotificationTapPresentationType.Enum[
                notificationTapPresentationType
            ]
        )
        request.setNotificationTapBehaviorUrl(notificationTapBehaviorUrl)
        request.setNotificationIosContentAvailable(
            notificationIosContentAvailable
        )
        request.setNotificationIosMutableContent(notificationIosMutableContent)
        request.setNotificationIosSound(notificationIosSound)
        request.setNotificationIosCategoryIdentifier(
            notificationIosCategoryIdentifier
        )
        request.setNotificationIosThreadIdentifier(
            notificationIosThreadIdentifier
        )
        request.setNotificationAndroidChannelId(notificationAndroidChannelId)
        request.setNotificationAndroidSound(notificationAndroidSound)
        request.setNotificationAndroidTag(notificationAndroidTag)
        request.setNotificationExpiration(notificationExpiration)
        request.setNotificationAlertOptionPushNotification(
            notificationAlertOptionPushNotification
        )
        request.setNotificationAlertOptionNotificationCenter(
            notificationAlertOptionNotificationCenter
        )
        request.setNotificationAlertOptionBadgeNumber(
            notificationAlertOptionBadgeNumber
        )
        const map = request.getNotificationAttributesMap()
        Object.keys(notificationAttributesMap).forEach(key => {
            const val = notificationAttributesMap[key].toString()
            map.set(key, val)
        })

        const response = await campaignsClient.updateNotificationSettings(
            request
        )

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

export default updateNotificationSettings

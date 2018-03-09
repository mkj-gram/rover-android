/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import Environment from '../Environment'

export const updateNotificationSettings: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (
    campaign: ScheduledCampaign | AutomatedNotificationCampaign,
    campaignId: string
) => (dispatch: Dispatch<State>, getState: () => State): Promise<Action> => {
    const query: DocumentNode = gql`
        mutation UpdateNotificationSetting(
            $campaignId: Int!
            $experienceId: String
            $UIState: String!
            $notificationBody: String!
            $notificationTitle: String
            $notificationAttachment: NotificationAttachmentInput
            $notificationTapBehaviorType: String
            $notificationTapPresentationType: String
            $notificationTapBehaviorUrl: String
            $notificationIosContentAvailable: Boolean!
            $notificationIosMutableContent: Boolean!
            $notificationIosSound: String
            $notificationIosCategoryIdentifier: String
            $notificationIosThreadIdentifier: String
            $notificationAndroidChannelId: String
            $notificationAndroidSound: String
            $notificationAndroidTag: String
            $notificationExpiration: Int
            $notificationAttributesMap: JSON
            $notificationAlertOptionPushNotification: Boolean!
            $notificationAlertOptionNotificationCenter: Boolean!
            $notificationAlertOptionBadgeNumber: Boolean!
        ) {
            updateNotificationSettings(
                campaignId: $campaignId
                experienceId: $experienceId
                UIState: $UIState
                notificationBody: $notificationBody
                notificationTitle: $notificationTitle
                notificationAttachment: $notificationAttachment
                notificationTapBehaviorType: $notificationTapBehaviorType
                notificationTapPresentationType: $notificationTapPresentationType
                notificationTapBehaviorUrl: $notificationTapBehaviorUrl
                notificationIosContentAvailable: $notificationIosContentAvailable
                notificationIosMutableContent: $notificationIosMutableContent
                notificationIosSound: $notificationIosSound
                notificationIosCategoryIdentifier: $notificationIosCategoryIdentifier
                notificationIosThreadIdentifier: $notificationIosThreadIdentifier
                notificationAndroidChannelId: $notificationAndroidChannelId
                notificationAndroidSound: $notificationAndroidSound
                notificationAndroidTag: $notificationAndroidTag
                notificationExpiration: $notificationExpiration
                notificationAttributesMap: $notificationAttributesMap
                notificationAlertOptionPushNotification: $notificationAlertOptionPushNotification
                notificationAlertOptionNotificationCenter: $notificationAlertOptionNotificationCenter
                notificationAlertOptionBadgeNumber: $notificationAlertOptionBadgeNumber
            ) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    notificationTitle
                    notificationBody
                    notificationAttachment {
                        type
                        url
                    }
                    notificationTapBehaviorType
                    notificationTapPresentationType
                    notificationTapBehaviorUrl
                    notificationIosContentAvailable
                    notificationIosMutableContent
                    notificationIosSound
                    notificationIosCategoryIdentifier
                    notificationIosThreadIdentifier
                    notificationAndroidChannelId
                    notificationAndroidSound
                    notificationAndroidTag
                    notificationExpiration
                    notificationAttributesMap
                    notificationAlertOptionPushNotification
                    notificationAlertOptionNotificationCenter
                    notificationAlertOptionBadgeNumber
                }
                ... on ScheduledNotificationCampaign {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentableCampaign {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationCampaign {
                    automatedMonday
                    automatedTuesday
                    automatedWednesday
                    automatedThursday
                    automatedFriday
                    automatedSaturday
                    automatedSunday
                    automatedStartDate
                    automatedEndDate
                    automatedStartTime
                    automatedEndTime
                    automatedTimeZone
                    automatedUseLocalDeviceTime
                    automatedEventName
                }
            }
        }
    `

    const request = {
        query,
        variables: {
            ...campaign
        }
    }

    return Environment(request).then(
        ({ data }) => {
            const campaign = data.updateNotificationSettings
            const campaigns = {
                ...getState().campaigns,
                [campaign.campaignId]: {
                    ...campaign
                }
            }
            dispatch({
                type: 'UPDATE_CAMPAIGN_NOTIFICATION_SETTINGS_SUCCESS',
                campaigns
            })
            return Promise.resolve(data)
        },
        error => {
            return dispatch({
                type: 'UPDATE_CAMPAIGN_NOTIFICATION_SETTINGS_FAILURE',
                message: error.message
            })
        }
    )
}

export const duplicateCampaign: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (name: string, campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action> => {
    const query: DocumentNode = gql`
        mutation DuplicateCampaign($name: String!, $campaignId: Int!) {
            duplicateCampaign(name: $name, campaignId: $campaignId) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    notificationTitle
                    notificationBody
                    notificationAttachment {
                        type
                        url
                    }
                    notificationTapBehaviorType
                    notificationTapPresentationType
                    notificationTapBehaviorUrl
                    notificationIosContentAvailable
                    notificationIosMutableContent
                    notificationIosSound
                    notificationIosCategoryIdentifier
                    notificationIosThreadIdentifier
                    notificationAndroidChannelId
                    notificationAndroidSound
                    notificationAndroidTag
                    notificationExpiration
                    notificationAttributesMap
                    notificationAlertOptionPushNotification
                    notificationAlertOptionNotificationCenter
                    notificationAlertOptionBadgeNumber
                }
                ... on ScheduledNotificationCampaign {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentableCampaign {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationCampaign {
                    automatedMonday
                    automatedTuesday
                    automatedWednesday
                    automatedThursday
                    automatedFriday
                    automatedSaturday
                    automatedSunday
                    automatedStartDate
                    automatedEndDate
                    automatedStartTime
                    automatedEndTime
                    automatedTimeZone
                    automatedUseLocalDeviceTime
                    automatedEventName
                }
            }
        }
    `

    const request = {
        query,
        variables: {
            name,
            campaignId
        }
    }

    return Environment(request).then(
        ({ data }) => {
            const campaigns = {
                ...getState().campaigns,
                [data.duplicateCampaign.campaignId]: {
                    ...data.duplicateCampaign
                }
            }
            dispatch({
                type: 'DUPLICATE_CAMPAIGN_SUCCESS',
                campaigns
            })
            return Promise.resolve(data.duplicateCampaign.campaignId)
        },
        error => {
            return dispatch({
                type: 'DUPLICATE_CAMPAIGN_FAILURE',
                message: error.message
            })
        }
    )
}

export const archiveCampaign: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action> => {
    const query: DocumentNode = gql`
        mutation ArchiveCampaign($campaignId: Int!) {
            archiveCampaign(campaignId: $campaignId)
        }
    `

    const request = {
        query,
        variables: {
            campaignId
        }
    }

    return Environment(request).then(
        ({ data }) => {
            const campaigns = {
                ...getState().campaigns,
                [campaignId]: {
                    ...getState().campaigns[campaignId],
                    campaignStatus: 'ARCHIVED'
                }
            }
            dispatch({
                type: 'ARCHIVE_CAMPAIGN_SUCCESS',
                campaigns
            })
            return Promise.resolve(data.archiveCampaign)
        },
        error => {
            return dispatch({
                type: ' ARCHIVE_CAMPAIGN_FAILURE',
                message: error.message
            })
        }
    )
}

export const renameCampaign: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (name: string, campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action> => {
    dispatch({
        type: 'SET_OVERVIEW_MODAL_NO_ANIMATION'
    })
    const query: DocumentNode = gql`
        mutation RenameCampaign($name: String!, $campaignId: Int!) {
            renameCampaign(name: $name, campaignId: $campaignId)
        }
    `

    const request = {
        query,
        variables: {
            name,
            campaignId
        }
    }

    return Environment(request)
        .then(
            ({ data }) => {
                const campaigns = {
                    ...getState().campaigns,
                    [campaignId]: {
                        ...getState().campaigns[campaignId],
                        name
                    }
                }
                return dispatch({
                    type: 'RENAME_CAMPAIGN_SUCCESS',
                    campaigns
                })
            },
            error => {
                return dispatch({
                    type: ' RENAME_CAMPAIGN_FAILURE',
                    message: error.message
                })
            }
        )
        .then(() => {
            return dispatch({
                type: 'SET_OVERVIEW_MODAL_RESET'
            })
        })
}

export const fetchCampaigns: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (
    campaignStatus: CampaignStatus,
    campaignType: CampaignType,
    pageNumber: number,
    keyword: string
) => (dispatch: Dispatch<State>): Promise<Action> => {
    // dispatch({ type: 'FETCH_CAMPAIGNS_REQUEST' })
    const query: DocumentNode = gql`
        query FetchCampaigns(
            $campaignStatus: String
            $campaignType: String
            $pageNumber: Int!
            $keyword: String
        ) {
            campaigns(
                campaignStatus: $campaignStatus
                campaignType: $campaignType
                pageNumber: $pageNumber
                keyword: $keyword
            ) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    notificationTitle
                    notificationBody
                    notificationAttachment {
                        type
                        url
                    }
                    notificationTapBehaviorType
                    notificationTapPresentationType
                    notificationTapBehaviorUrl
                    notificationIosContentAvailable
                    notificationIosMutableContent
                    notificationIosSound
                    notificationIosCategoryIdentifier
                    notificationIosThreadIdentifier
                    notificationAndroidChannelId
                    notificationAndroidSound
                    notificationAndroidTag
                    notificationExpiration
                    notificationAttributesMap
                    notificationAlertOptionPushNotification
                    notificationAlertOptionNotificationCenter
                    notificationAlertOptionBadgeNumber
                }
                ... on ScheduledNotificationCampaign {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentableCampaign {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationCampaign {
                    automatedMonday
                    automatedTuesday
                    automatedWednesday
                    automatedThursday
                    automatedFriday
                    automatedSaturday
                    automatedSunday
                    automatedStartDate
                    automatedEndDate
                    automatedStartTime
                    automatedEndTime
                    automatedTimeZone
                    automatedUseLocalDeviceTime
                    automatedEventName
                }
            }
        }
    `

    const request = {
        query: query,
        variables: {
            campaignStatus:
                campaignStatus === 'UNKNOWN' ? null : campaignStatus,
            campaignType: campaignType === 'UNKNOWN' ? null : campaignType,
            pageNumber: pageNumber || 0,
            keyword: keyword || null
        }
    }
    return Environment(request).then(
        ({ data }) => {
            let campaigns = null
            if (data.campaigns) {
                campaigns = data.campaigns.reduce(
                    (prev: Campaign, next: Campaign) => {
                        return { [next.campaignId]: next, ...prev }
                        // tslint:disable-next-line:align
                    },
                    {}
                )
            }

            return dispatch({
                type: 'FETCH_CAMPAIGNS_SUCCESS',
                campaigns
            })
        },
        error => {
            return dispatch({
                type: 'FETCH_CAMPAIGNS_FAILURE',
                message: error.message
            })
        }
    )
}

export const createCampaign: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (name: string, campaignType: CampaignType) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action> => {
    dispatch({ type: `CREATE_CAMPAIGN_REQUEST` })

    const query = gql`
        mutation CreateCampaign($name: String!, $campaignType: String!) {
            createCampaign(name: $name, campaignType: $campaignType) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    notificationTitle
                    notificationBody
                    notificationAttachment {
                        type
                        url
                    }
                    notificationTapBehaviorType
                    notificationTapPresentationType
                    notificationTapBehaviorUrl
                    notificationIosContentAvailable
                    notificationIosMutableContent
                    notificationIosSound
                    notificationIosCategoryIdentifier
                    notificationIosThreadIdentifier
                    notificationAndroidChannelId
                    notificationAndroidSound
                    notificationAndroidTag
                    notificationExpiration
                    notificationAttributesMap
                    notificationAlertOptionPushNotification
                    notificationAlertOptionNotificationCenter
                    notificationAlertOptionBadgeNumber
                }
                ... on ScheduledNotificationCampaign {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentableCampaign {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationCampaign {
                    automatedMonday
                    automatedTuesday
                    automatedWednesday
                    automatedThursday
                    automatedFriday
                    automatedSaturday
                    automatedSunday
                    automatedStartDate
                    automatedEndDate
                    automatedStartTime
                    automatedEndTime
                    automatedTimeZone
                    automatedUseLocalDeviceTime
                    automatedEventName
                }
            }
        }
    `

    const request = {
        query: query,
        variables: {
            name: name,
            campaignType: campaignType
        }
    }

    return Environment(request).then(
        ({ data }) => {
            const campaigns = {
                ...getState().campaigns,
                [data.createCampaign.campaignId]: { ...data.createCampaign }
            }
            dispatch({
                type: 'CREATE_CAMPAIGN_SUCCESS',
                campaigns
            })
            dispatch({ type: `CLOSE_NEW_CAMPAIGN_POPOVER` })
            return Promise.resolve(data.createCampaign.campaignId)
        },
        error => {
            dispatch({ type: `CLOSE_NEW_CAMPAIGN_POPOVER` })
            return dispatch({
                type: 'CREATE_CAMPAIGN_FAILURE',
                message: error.message
            })
        }
    )
}

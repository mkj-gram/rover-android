/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { DocumentNode } from 'graphql'
import Environment from '../Environment'
import handleError from '../Environment/handleError'
import { setTimeout } from 'timers'

export const publishCampaign: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (campaignId: number) => (
    dispatch: Dispatch<State>
): Promise<Action | void> => {
    const query: DocumentNode = gql`
        mutation PublishCampaign($campaignId: Int!) {
            publishCampaign(campaignId: $campaignId)
        }
    `

    const request = {
        query,
        variables: {
            campaignId
        }
    }
    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'PUBLISH_CAMPAIGN_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                return dispatch({
                    type: 'PUBLISH_CAMPAIGN_SUCCESS'
                })
            }
        },
        ({ result }) =>
            handleError(
                'PUBLISH_CAMPAIGN_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const updateScheduledDeliverySettings: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
    const query: DocumentNode = gql`
        mutation UpdateScheduledDeliverySettings(
            $campaignId: Int!
            $scheduledDate: DateTime
            $scheduledTime: Int
            $scheduledTimeZone: String!
            $scheduledUseLocalDeviceTime: Boolean!
            $segmentCondition: SegmentCondition!
            $segmentIds: [String!]!
            $UIState: String!
            $scheduledType: ScheduledType!
        ) {
            updateScheduledDeliverySettings(
                campaignId: $campaignId
                scheduledDate: $scheduledDate
                scheduledTime: $scheduledTime
                scheduledTimeZone: $scheduledTimeZone
                scheduledType: $scheduledType
                scheduledUseLocalDeviceTime: $scheduledUseLocalDeviceTime
                segmentCondition: $segmentCondition
                segmentIds: $segmentIds
                UIState: $UIState
            ) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    experienceId
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
                    scheduledDate
                    scheduledTime
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentableCampaign {
                    segmentIds
                    segmentCondition
                }
            }
        }
    `

    const state = getState()
    const { editableCampaign, editableUIState } = state
    const {
        campaignId,
        scheduledDate,
        scheduledTime,
        scheduledTimeZone,
        scheduledType,
        scheduledUseLocalDeviceTime,
        segmentCondition,
        segmentIds
    } = editableCampaign as ScheduledCampaign

    const request = {
        query,
        variables: {
            campaignId,
            scheduledDate,
            scheduledTime,
            scheduledTimeZone,
            scheduledType,
            scheduledUseLocalDeviceTime,
            segmentCondition,
            segmentIds,
            UIState: JSON.stringify(editableUIState)
        }
    }
    dispatch({ type: 'UPDATE_SCHEDULED_DELIVERY_SETTINGS_REQUEST' })
    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'UPDATE_SCHEDULED_DELIVERY_SETTINGS_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                const campaign = data.updateScheduledDeliverySettings
                const campaigns = {
                    ...getState().campaigns,
                    [campaign.campaignId]: {
                        ...campaign
                    }
                }
                return dispatch({
                    type: 'UPDATE_SCHEDULED_DELIVERY_SETTINGS_SUCCESS',
                    campaigns
                })
            }
        },
        ({ result }) =>
            handleError(
                'UPDATE_SCHEDULED_DELIVERY_SETTINGS_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const updateNotificationSettings: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
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
                    experienceId
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
                    scheduledDate
                    scheduledTime
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
    const state = getState()
    const { editableCampaign, editableUIState } = state
    const newCampaign = {
        ...editableCampaign,
        UIState: JSON.stringify(editableUIState)
    }

    const request = {
        query,
        variables: {
            ...newCampaign
        }
    }

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'UPDATE_CAMPAIGN_NOTIFICATION_SETTINGS_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                const campaign = data.updateNotificationSettings
                const campaigns = {
                    ...getState().campaigns,
                    [campaign.campaignId]: {
                        ...campaign
                    }
                }
                return dispatch({
                    type: 'UPDATE_CAMPAIGN_NOTIFICATION_SETTINGS_SUCCESS',
                    campaigns
                })
            }
        },
        ({ result }) =>
            handleError(
                'UPDATE_CAMPAIGN_NOTIFICATION_SETTINGS_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const fetchCampaign: ActionCreator<
    ThunkAction<Promise<Action | void | {}>, State, void>
> = (campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void | {}> => {
    const query: DocumentNode = gql`
        query FetchCampaign($campaignId: Int!) {
            campaign(campaignId: $campaignId) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    experienceId
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
                    scheduledDate
                    scheduledTime
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
            campaignId
        }
    }
    return Environment(request).then(
        ({ data, errors }) => {
            return new Promise((resolve, reject) => {
                if (errors) {
                    handleError(
                        'FETCH_CAMPAIGN_FAILURE',
                        dispatch,
                        errors[0].message
                    )
                } else {
                    const campaigns = {
                        ...getState().campaigns,
                        [data.campaign.campaignId]: {
                            ...data.campaign
                        }
                    }
                    dispatch({
                        type: 'FETCH_CAMPAIGN_SUCCESS',
                        campaigns
                    })
                    resolve()
                }
            })
        },
        ({ result }) =>
            handleError(
                'FETCH_CAMPAIGN_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const duplicateCampaign: ActionCreator<
    ThunkAction<Promise<number>, State, void>
> = (name: string, campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<number> => {
    const query: DocumentNode = gql`
        mutation DuplicateCampaign($name: String!, $campaignId: Int!) {
            duplicateCampaign(name: $name, campaignId: $campaignId) {
                campaignId
                name
                campaignType
                campaignStatus
                UIState
                ... on NotificationCampaign {
                    experienceId
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
                    scheduledDate
                    scheduledTime
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

    dispatch({
        type: 'TRIGGERED_ANIMATION',
        trigger: 'duplicate'
    })
    dispatch({
        type: 'CLOSING_OVERVIEW_MODAL'
    })
    let closed = false
    setTimeout(() => {
        dispatch({
            type: 'CLOSED_OVERVIEW_MODAL'
        })
        closed = true
    }, 350)

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                dispatch({
                    type: 'DUPLICATE_CAMPAIGN_FAILURE',
                    message: errors[0].message
                })
                return new Promise(resolve => {
                    setTimeout(() => {
                        dispatch({
                            type: 'OPEN_OVERVIEW_MODAL'
                        })
                        return resolve()
                    }, !closed ? 350 : 0)
                    setTimeout(() => {
                        dispatch({ type: 'DISMISS_FAILURE' })
                    }, 4000)
                }).then(res => Promise.resolve(campaignId))
            } else {
                const campaigns = {
                    ...getState().campaigns,
                    [data.duplicateCampaign.campaignId]: {
                        ...data.duplicateCampaign
                    }
                }

                return new Promise(resolve => {
                    setTimeout(() => {
                        dispatch({
                            type: 'OPEN_OVERVIEW_MODAL'
                        })
                        return resolve()
                    }, !closed ? 350 : 0)
                }).then(result => {
                    dispatch({
                        type: 'DUPLICATE_CAMPAIGN_SUCCESS',
                        campaigns
                    })
                    return Promise.resolve(data.duplicateCampaign.campaignId)
                })
            }
        },
        ({ result }) => {
            dispatch({
                type: 'DUPLICATE_CAMPAIGN_FAILURE',
                message: result.errors[0].message
            })
            return new Promise(resolve => {
                setTimeout(() => {
                    dispatch({
                        type: 'OPEN_OVERVIEW_MODAL'
                    })
                    return resolve()
                }, !closed ? 350 : 0)
                setTimeout(() => {
                    dispatch({ type: 'DISMISS_FAILURE' })
                }, 4000)
            }).then(res => Promise.resolve(campaignId))
        }
    )
}

export const archiveCampaign: ActionCreator<
    ThunkAction<Promise<boolean>, State, void>
> = (campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<boolean> => {
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

    dispatch({
        type: 'TRIGGERED_ANIMATION',
        trigger: ''
    })
    dispatch({
        type: 'CLOSING_OVERVIEW_MODAL'
    })
    let closed = false
    setTimeout(() => {
        dispatch({
            type: 'CLOSED_OVERVIEW_MODAL'
        })
        closed = true
    }, 350)

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                dispatch({
                    type: 'ARCHIVE_CAMPAIGN_FAILURE',
                    message: errors[0].message
                })
                return new Promise(resolve => {
                    setTimeout(() => {
                        dispatch({
                            type: 'OPEN_OVERVIEW_MODAL'
                        })
                    }, !closed ? 300 : 0)
                    setTimeout(() => {
                        dispatch({ type: 'DISMISS_FAILURE' })
                        return resolve()
                    }, 4000)
                }).then(res => Promise.resolve(false))
            } else {
                const campaigns = {
                    ...getState().campaigns,
                    [campaignId]: {
                        ...getState().campaigns[campaignId],
                        campaignStatus: 'ARCHIVED'
                    }
                }
                return new Promise(resolve => {
                    setTimeout(() => {
                        dispatch({
                            type: 'ARCHIVE_CAMPAIGN_SUCCESS',
                            campaigns
                        })
                        return resolve()
                    }, !closed ? 300 : 0)
                }).then(res => Promise.resolve(true))
            }
        },
        ({ result }) => {
            dispatch({
                type: ' ARCHIVE_CAMPAIGN_FAILURE',
                message: result.errors[0].message
            })
            return new Promise(resolve => {
                setTimeout(() => {
                    dispatch({
                        type: 'OPEN_OVERVIEW_MODAL'
                    })
                    return resolve()
                }, !closed ? 300 : 0)
                setTimeout(() => {
                    dispatch({ type: 'DISMISS_FAILURE' })
                }, 4000)
            }).then(res => Promise.resolve(false))
        }
    )
}

export const renameCampaign: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (name: string, campaignId: number) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
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

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'RENAME_CAMPAIGN_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
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
            }
        },
        ({ result }) =>
            handleError(
                'RENAME_CAMPAIGN_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const fetchCampaigns: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (
    campaignStatus: CampaignStatus,
    campaignType: CampaignType,
    pageNumber: number,
    keyword: string
) => (dispatch: Dispatch<State>): Promise<Action | void> => {
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
                    experienceId
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
                    scheduledDate
                    scheduledTime
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
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_CAMPAIGNS_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
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
            }
        },
        ({ result }) =>
            handleError(
                'FETCH_CAMPAIGNS_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const createCampaign: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (name: string, campaignType: CampaignType) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
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
                    experienceId
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
                    scheduledDate
                    scheduledTime
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
        ({ data, errors }) => {
            if (errors) {
                dispatch({ type: `CLOSE_NEW_CAMPAIGN_POPOVER` })
                return handleError(
                    'CREATE_CAMPAIGN_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                const campaigns = {
                    ...getState().campaigns,
                    [data.createCampaign.campaignId]: {
                        ...data.createCampaign
                    }
                }
                dispatch({
                    type: 'CREATE_CAMPAIGN_SUCCESS',
                    campaigns
                })
                dispatch({ type: `CLOSE_NEW_CAMPAIGN_POPOVER` })
                return Promise.resolve(data.createCampaign.campaignId)
            }
        },
        ({ result }) => {
            dispatch({ type: `CLOSE_NEW_CAMPAIGN_POPOVER` })
            return handleError(
                'CREATE_CAMPAIGN_FAILURE',
                dispatch,
                result.errors[0].message
            )
        }
    )
}

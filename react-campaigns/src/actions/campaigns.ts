/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export const fetchCampaigns: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (
    campaignStatus: CampaignStatus,
    campaignType: CampaignType,
    pageNumber: number,
    keyword: string
) => (dispatch: Dispatch<State>): Promise<Action> => {
    // const isFetching = getState().app.list.isFetching

    // if (false) {
    //     return Promise.resolve()
    // }

    dispatch({ type: 'FETCH_CAMPAIGNS_REQUEST' })

    const query: DocumentNode = gql`
        query FetchCampaigns {
            campaigns {
                campaignId
                name
                campaignType
                campaignStatus
                ... on Notification {
                    notificationTitle
                    notificationAttachmentUrl
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
                ... on ScheduledNotificationDetails {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentIdList {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationDetails {
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
        variables: {}
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
    dispatch: Dispatch<State>
): Promise<Action> => {
    dispatch({ type: `CREATE_CAMPAIGN_REQUEST` })

    const query = gql`
        mutation CreateCampaign($name: String!, $campaignType: String!) {
            createCampaign(name: $name, campaignType: $campaignType) {
                campaignId
                name
                campaignType
                campaignStatus
                ... on Notification {
                    notificationTitle
                    notificationAttachmentUrl
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
                ... on ScheduledNotificationDetails {
                    scheduledType
                    scheduledTimeZone
                    scheduledTimestamp
                    scheduledUseLocalDeviceTime
                    scheduledDeliveryStatus
                }
                ... on SegmentIdList {
                    segmentIds
                    segmentCondition
                }
                ... on AutomatedNotificationDetails {
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
            const campaign = {
                [data.createCampaign.campaignId]: { ...data.createCampaign }
            }
            return dispatch({
                type: 'CREATE_CAMPAIGN_SUCCESS',
                campaigns: { ...campaign }
            })
        },
        error => {
            return dispatch({
                type: 'CREATE_CAMPAIGN_FAILURE',
                message: error.message
            })
        }
    )
}

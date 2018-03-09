/// <reference path="../../typings/index.d.ts"/>

import * as editableCampaignActions from './editableCampaign'
import * as campaignsActions from './campaigns'
import * as testDevicesActions from './testDevices'
import * as modalActions from './modal'
import * as H from 'history'

import { Action, Dispatch, ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

// Overview Modal
export const handleSendTestModalDisplay = (on?: boolean) =>
    modalActions.handleSendTestModalDisplay(on)

export const handleOverviewModalDisplay = (history: H.History) =>
    modalActions.handleOverviewModalDisplay(history)

export const handleAlertOptionsModalDisplay = (deviceInfoSelected?: string) =>
    modalActions.handleAlertOptionsModalDisplay(deviceInfoSelected)

export const fetchTestDevices = (
    predicates?: string,
    pageNumber?: number,
    pageSize?: number,
    condition?: string
) =>
    testDevicesActions.fetchTestDevices(
        predicates,
        pageNumber,
        pageSize,
        condition
    )

// Campaigns
export const fetchCampaigns = (
    campaignStatus?: CampaignStatus,
    campaignType?: CampaignType,
    pageNumber?: number,
    keyword?: string
) =>
    campaignsActions.fetchCampaigns(
        campaignStatus,
        campaignType,
        pageNumber,
        keyword
    )

export const createCampaign = (name: string, campaignType: CampaignType) =>
    campaignsActions.createCampaign(name, campaignType)

export const renameCampaign = (name: string, campaignId: number) =>
    campaignsActions.renameCampaign(name, campaignId)

export const duplicateCampaign = (name: string, campaignId: number) =>
    campaignsActions.duplicateCampaign(name, campaignId)

export const archiveCampaign = (campaignId: number) =>
    campaignsActions.archiveCampaign(campaignId)

export const updateNotificationSettings = (
    campaign: ScheduledCampaign | AutomatedNotificationCampaign,
    campaignId: string
) => campaignsActions.updateNotificationSettings(campaign, campaignId)

// Home
export const openNewCampaignPopover: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'OPEN_NEW_CAMPAIGN_POPOVER' })
}

export const closeNewCampaignPopover: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'CLOSE_NEW_CAMPAIGN_POPOVER' })
}

export const openCampaignTypeSelector: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'OPEN_CAMPAIGN_TYPE_SELECTOR' })
}

export const startClosingCampaignTypeSelector: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR' })
}

export const closeCampaignTypeSelector: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'CLOSE_CAMPAIGN_TYPE_SELECTOR' })
}

// Editable Campaign
export const updateEditableCampaign = (val: object) =>
    editableCampaignActions.updateEditableCampaign(val)

export const createEditableCampaign = (
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
) => editableCampaignActions.createEditableCampaign(editableCampaign)

// Notification Delivery Modal

export const openNotificationDeliveryModal: ActionCreator<
    ThunkAction<void, State, void>
> = (open: boolean) => (dispatch: Dispatch<State>): void => {
    if (open) {
        dispatch({ type: 'OPEN_NOTIFICATION_DELIVERY_MODAL' })
    } else {
        dispatch({ type: 'CLOSING_NOTIFICATION_DELIVERY_MODAL' })
        setTimeout(() => {
            dispatch({
                type: 'CLOSE_NOTIFICATION_DELIVERY_MODAL'
            })
        }, 500)
    }
}

export const updateLastVewPage: ActionCreator<
    ThunkAction<void, State, void>
> = (lastViewPage: string) => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'UPDATE_LAST_VIEW_PAGE', lastViewPage })
}

// Notification: Alert Options

export const setHoverOption: ActionCreator<ThunkAction<void, State, void>> = (
    hover: string
) => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'SET_HOVER_OPTION', hover })
}

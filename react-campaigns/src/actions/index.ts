/// <reference path="../../typings/index.d.ts"/>

import * as editableCampaignActions from './editableCampaign'
import * as editableUIStateActions from './editableUIState'
import * as campaignsActions from './campaigns'
import * as testDevicesActions from './testDevices'
import * as notificationActions from './notification'
import * as sendTestActions from './sendTest'

import * as overviewActions from './overview'
import * as H from 'history'

import { Action, Dispatch, ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

// Overview Modal
export const handleSendTestModalDisplay = (on?: boolean) =>
    overviewActions.handleSendTestModalDisplay(on)

export const handleOverviewModalDisplay = (history: H.History, open: boolean) =>
    overviewActions.handleOverviewModalDisplay(history, open)

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
export const fetchCampaign = (campaignId: number) =>
    campaignsActions.fetchCampaign(campaignId)

export const createCampaign = (name: string, campaignType: CampaignType) =>
    campaignsActions.createCampaign(name, campaignType)

export const renameCampaign = (name: string, campaignId: number) =>
    campaignsActions.renameCampaign(name, campaignId)

export const duplicateCampaign = (name: string, campaignId: number) =>
    campaignsActions.duplicateCampaign(name, campaignId)

export const archiveCampaign = (campaignId: number) =>
    campaignsActions.archiveCampaign(campaignId)

export const updateNotificationSettings = () =>
    campaignsActions.updateNotificationSettings()

export const sendTest = (campaignId: number, deviceIds: string[]) =>
    sendTestActions.sendTest(campaignId, deviceIds)

export const updateSelectedTestDevices = (deviceIds: string[]) =>
    testDevicesActions.updateSelectedTestDevices(deviceIds)

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

export const createEditableCampaign = (campaignId: string) =>
    editableCampaignActions.createEditableCampaign(campaignId)

export const updateEditableUIState = (
    newUIStateGroup: keyof editableUIState,
    newUIStateValue: UIStateField | boolean
) =>
    editableUIStateActions.updateEditableUIState(
        newUIStateGroup,
        newUIStateValue
    )

// Form
export const setCurrentFormPage: ActionCreator<
    ThunkAction<void, State, void>
> = (currentPage: formPage) => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'UPDATE_CURRENT_PAGE', currentPage: currentPage })
}
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
            // tslint:disable-next-line:align
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

export const handleAlertOptionsModalDisplay = (deviceInfoSelected?: string) =>
    notificationActions.handleAlertOptionsModalDisplay(deviceInfoSelected)

// Notifications: Tap Behavior
export const openTapBehaviorSelector: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'OPEN_TAP_BEHAVIOR_SELECTOR' })
}

export const closeTapBehaviorSelector: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'CLOSING_TAP_BEHAVIOR_SELECTOR' })
    setTimeout(() => {
        dispatch({
            type: 'CLOSE_TAP_BEHAVIOR_SELECTOR'
        })
        // tslint:disable-next-line:align
    }, 500)
}

export const openTapBehaviorWebsitePresentation: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'OPEN_TAP_BEHAVIOR_WEBSITE_PRESENTATION' })
}

export const closeTapBehaviorWebsitePresentation: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'CLOSING_TAP_BEHAVIOR_WEBSITE_PRESENTATION' })
    setTimeout(() => {
        dispatch({
            type: 'CLOSE_TAP_BEHAVIOR_WEBSITE_PRESENTATION'
        })
        // tslint:disable-next-line:align
    }, 500)
}

// Popover Modal
export const updateActivePopover: ActionCreator<
    ThunkAction<void, State, void>
> = (field: string) => (dispatch: Dispatch<State>): void => {
    dispatch({
        type: 'UPDATE_ACTIVE_POPOVER',
        field
    })
}

export const openPopoverModalForm: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'OPEN_POPOVER_MODAL_FORM' })
}

export const closePopoverModalForm: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({ type: 'CLOSING_POPOVER_MODAL_FORM' })
    setTimeout(() => {
        dispatch({
            type: 'CLOSE_POPOVER_MODAL_FORM'
        })
    }, 500)
}

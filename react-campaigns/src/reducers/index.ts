/// <reference path="../../typings/index.d.ts" />

import { combineReducers, AnyAction } from 'redux'

import app, * as appSelector from './app'
import editableCampaign, * as editableCampaignSelector from './editableCampaign'
import editableUIState, * as editableUIStateSelector from './editableUIState'
import campaigns, * as campaignsSelector from './campaigns'
import testDevices, * as testDeviceSelector from './testDevices'

export default combineReducers({
    app,
    campaigns,
    testDevices,
    editableCampaign,
    editableUIState
})

// Error
export const getIsError = (state: State) => appSelector.getIsError(state.app)

// App
export const getIsCreatingCampaign = (state: State) =>
    appSelector.getIsCreatingCampaign(state.app)

export const getIsFetching = (state: State) =>
    appSelector.getIsFetching(state.app)

export const getIsNewCampaignPopoverOpen = (state: State) =>
    appSelector.getIsNewCampaignPopoverOpen(state.app)

export const getIsNewCampaignPopoverClosing = (state: State) =>
    appSelector.getIsNewCampaignPopoverClosing(state.app)

export const getIsCampaignTypeSelectorOpen = (state: State) =>
    appSelector.getIsCampaignTypeSelectorOpen(state.app)

export const getIsCampaignTypeSelectorClosing = (state: State) =>
    appSelector.getIsCampaignTypeSelectorClosing(state.app)

// Overview
export const getIsOverviewModalOpen = (state: State) =>
    appSelector.getIsOverviewModalOpen(state.app)

export const getIsSendTestModalOpen = (state: State) =>
    appSelector.getIsSendTestModalOpen(state.app)

// Notification Delivery
export const getIsNotificationDeliveryModalOpen = (state: State) =>
    appSelector.getIsNotificationDeliveryModalOpen(state.app)

// Notification: Alert Options
export const getAlertOptionHoverValue = (state: State) =>
    appSelector.getAlertOptionHoverValue(state.app)

export const getIsAlertOptionsOpen = (state: State) =>
    appSelector.getIsAlertOptionsOpen(state.app)

// Notification: Get Last View Page
export const getLastViewPage = (state: State) =>
    appSelector.getLastViewPage(state.app)

// Notification: Tap Behavior
export const getIsTapBehaviorSelectorOpen = (state: State) =>
    appSelector.getIsTapBehaviorSelectorOpen(state.app)

export const getIsTapBehaviorWebsitePresentationOpen = (state: State) =>
    appSelector.getIsTapBehaviorWebsitePresentationOpen(state.app)

// Campaigns
export const getCampaign = (state: State, id: string) =>
    campaignsSelector.getCampaign(state.campaigns, id)

export const getAllCampaigns = (state: State) =>
    campaignsSelector.getAllCampaigns(state.campaigns)

export const getFilteredCampaigns = (state: State, filter: CampaignStatus) =>
    campaignsSelector.getFilteredCampaigns(state.campaigns, filter)

// Editable Campaign
// Active Popover
export const getActivePopover = (state: State) =>
    appSelector.getActivePopover(state.app)

export const getIsPopoverModalFormOpen = (state: State) =>
    appSelector.getIsPopoverModalFormOpen(state.app)

export const getEditableCampaign = (state: State) =>
    editableCampaignSelector.getEditableCampaign(state)

export const getShouldShowSaveAndClose = (state: State) =>
    editableCampaignSelector.getShouldShowSaveAndClose(state)

// Editable UIState
export const getEditableUIState = (state: State) =>
    editableUIStateSelector.getEditableUIState(state)

export const getIsStageValid = (state: State, stage: keyof editableUIState) =>
    editableUIStateSelector.getIsStageValid(state, stage)

export const getTypeProgress = (state: State, type: UIStateType) =>
    editableUIStateSelector.getTypeProgress(state, type)

// Test Devices
export const getTestDevices = (state: State) =>
    testDeviceSelector.getTestDevices(state)

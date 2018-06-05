/// <reference path="../../typings/index.d.ts" />

import { combineReducers, AnyAction } from 'redux'

import app, * as appSelector from './app'
import campaigns, * as campaignsSelector from './campaigns'
import editableCampaign, * as editableCampaignSelector from './editableCampaign'
import editableUIState, * as editableUIStateSelector from './editableUIState'
import segments, * as segmentsSelector from './segments'
import testDevices, * as testDevicesSelector from './testDevices'

export default combineReducers({
    app,
    campaigns,
    editableCampaign,
    editableUIState,
    segments,
    testDevices
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

// Audience
export const getAggregateAudienceSize = (state: State, segmentId: string) =>
    appSelector.getAggregateAudienceSize(state.app, segmentId)

export const getTotalAudienceSize = (state: State) =>
    appSelector.getTotalAudienceSize(state.app)

// Overview
export const getIsOverviewModalOpen = (state: State) =>
    appSelector.getIsOverviewModalOpen(state.app)

// Overview: Send Test
export const getSelectedTestDevices = (state: State) =>
    testDevicesSelector.getSelectedTestDevices(state.testDevices)

export const getIsSendTestModalOpen = (state: State) =>
    appSelector.getIsSendTestModalOpen(state.app)

// Overview: Animation Trigger
export const getTriggeredAnimation = (state: State) =>
    appSelector.getTriggeredAnimation(state.app)

// Form
export const getCurrentFormPage = (state: State) =>
    appSelector.getCurrentFormPage(state.app)

export const getShouldShowPhonePreview = (state: State) =>
    appSelector.getShouldShowPhonePreview(state.app)

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

// WizardModal
export const getCurrentWizard = (state: State) =>
    appSelector.getCurrentWizard(state.app)

export const getIsWizardModalOpen = (state: State) =>
    appSelector.getIsWizardModalOpen(state.app)

export const getIsWizardModalClosing = (state: State) =>
    appSelector.getIsWizardModalClosing(state.app)

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

export const getDisplayTime = (state: State) =>
    editableCampaignSelector.getDisplayTime(state)

export const getFormatDate = (state: State) =>
    editableCampaignSelector.getFormatDate(state)

// Editable UIState
export const getEditableUIState = (state: State) =>
    editableUIStateSelector.getEditableUIState(state)

export const getIsStageValid = (state: State, stage: keyof editableUIState) =>
    editableUIStateSelector.getIsStageValid(state, stage)

export const getTypeProgress = (state: State, type: UIStateType) =>
    editableUIStateSelector.getTypeProgress(state, type)

// Segments
export const getAllSegments = (state: State) =>
    segmentsSelector.getAllSegments(state.segments)

export const getSegment = (state: State, segmentId: string) =>
    segmentsSelector.getSegment(state.segments, segmentId)

// Test Devices
export const getTestDevices = (state: State) =>
    testDevicesSelector.getTestDevices(state.testDevices)

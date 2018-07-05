/// <reference path="../../typings/index.d.ts" />

import { combineReducers, AnyAction } from 'redux'

import app, * as appSelector from './app'
import campaigns, * as campaignsSelector from './campaigns'
import editableCampaign, * as editableCampaignSelector from './editableCampaign'
import editableUIState, * as editableUIStateSelector from './editableUIState'
import experiences, * as experiencesSelector from './experiences'
import reports, * as reportsSelector from './reports'
import segments, * as segmentsSelector from './segments'
import testDevices, * as testDevicesSelector from './testDevices'
import user, * as userSelector from './user'

export default combineReducers({
    app,
    campaigns,
    editableCampaign,
    editableUIState,
    experiences,
    reports,
    segments,
    testDevices,
    user
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
export const getAudience = (state: State) => appSelector.getAudience(state.app)

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

// Phone Preview
export const getIsPhonePreviewActive = (state: State, preview: string) =>
    appSelector.getIsPhonePreviewActive(state.app, preview)

export const getIsPhonePreviewClosing = (state: State) =>
    appSelector.getIsPhonePreviewClosing(state.app)

// Form
export const getCurrentFormPage = (state: State) =>
    appSelector.getCurrentFormPage(state.app)

export const getShouldShowPhonePreview = (state: State) =>
    appSelector.getShouldShowPhonePreview(state.app)

export const getIsAudienceSizeUpdating = (state: State) =>
    appSelector.getIsAudienceSizeUpdating(state.app)

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

export const getCampaignDisplayTime = (state: Campaign, timeField: string) =>
    campaignsSelector.getDisplayTime(state, timeField)

export const getCampaignExists = (state: State, id: string) =>
    campaignsSelector.getCampaignExists(state.campaigns, id)

export const getCampaignFormatDate = (state: Campaign, dateField: string) =>
    campaignsSelector.getFormatDate(state, dateField)

export const getDuplicateCampaignName = (campaign: Campaign) =>
    campaignsSelector.getDuplicateCampaignName(campaign)
// Editable UIState
export const getEditableUIState = (state: State) =>
    editableUIStateSelector.getEditableUIState(state)

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

export const getEditableCampaignDisplayTime = (
    state: State,
    timeField: string
) => editableCampaignSelector.getDisplayTime(state, timeField)

export const getEditableCampaignFormatDate = (
    state: State,
    dateField: string
) => editableCampaignSelector.getFormatDate(state, dateField)

// Segments
export const getAllSegments = (state: State) =>
    segmentsSelector.getAllSegments(state.segments)

export const getUnselectedSegments = (state: State) =>
    segmentsSelector.getUnselectedSegments(state)

export const getSegment = (state: State, segmentId: string) =>
    segmentsSelector.getSegment(state.segments, segmentId)

// Test Devices
export const getTestDevices = (state: State) =>
    testDevicesSelector.getTestDevices(state.testDevices)

// Experiences
export const getExperiences = (state: State) =>
    experiencesSelector.getExperiences(state.experiences)

export const getExperience = (state: State, id: string) =>
    experiencesSelector.getExperience(state.experiences, id)

// User Account
export const getUser = (state: State) => userSelector.getUser(state.user)
// Campaign Progress Calculations
export const getCampaignTotalProgress = (state: State, id: string) => {
    const campaign = getCampaign(state, id) as
        | AutomatedNotificationCampaign
        | ScheduledCampaign
    if (campaign.UIState.length === 0) {
        return 0
    }

    const uiState = JSON.parse(campaign.UIState) as editableUIState
    const denominator = Object.keys(uiState).length
    const numerator = Object.keys(uiState)
        .filter(
            (field: keyof editableUIState) =>
                (uiState[field] as UIStateField).seen
        )
        .filter((field: keyof editableUIState) =>
            getIsStageValid(campaign, uiState, field)
        ).length

    return Math.round((numerator / denominator) * 100)
}

export const getTypeProgress = (
    campaign: AutomatedNotificationCampaign | ScheduledCampaign,
    uiState: editableUIState,
    type: UIStateType
): number => {
    const fields = Object.keys(uiState).filter(
        (field: keyof editableUIState) =>
            (uiState[field] as UIStateField).type === type
    )

    return (
        (fields
            .filter(
                (field: keyof editableUIState) =>
                    (uiState[field] as UIStateField).seen
            )
            .filter((field: keyof editableUIState) =>
                getIsStageValid(campaign, uiState, field)
            ).length *
            100) /
        fields.length
    )
}

export const getIsStageValid = (
    campaign: AutomatedNotificationCampaign | ScheduledCampaign,
    uiState: editableUIState,
    stage: keyof editableUIState
): boolean => {
    switch (stage) {
        // Notification Settings
        case 'messageAndMedia':
            const { notificationBody } = campaign
            return notificationBody !== ''
        case 'alertOptions':
            return (
                (campaign.notificationAlertOptionPushNotification ||
                    campaign.notificationAlertOptionNotificationCenter) &&
                getIsStageValid(campaign, uiState, 'messageAndMedia')
            )
        case 'tapBehavior':
            const {
                experienceId,
                notificationTapBehaviorType,
                notificationTapBehaviorUrl
            } = campaign

            if (!getIsStageValid(campaign, uiState, 'alertOptions')) {
                return false
            }

            switch (notificationTapBehaviorType) {
                case 'OPEN_APP':
                    return true
                case 'OPEN_EXPERIENCE':
                    return experienceId !== ''
                case 'OPEN_DEEP_LINK':
                case 'OPEN_WEBSITE':
                    return notificationTapBehaviorUrl !== ''
                default:
                    return false
            }
        case 'advancedSettings':
            return getIsStageValid(campaign, uiState, 'tapBehavior')

        // Scheduled Delivery Settings
        case 'dateAndTime':
            const {
                scheduledType,
                scheduledDate,
                scheduledTime
            } = campaign as ScheduledCampaign
            switch (scheduledType) {
                case 'NOW':
                    return true
                case 'SCHEDULED':
                    return scheduledDate !== null && scheduledTime !== null
                default:
                    return false
            }
        case 'audience':
            const { audience } = uiState
            const { conditionSelected } = audience
            const { segmentIds } = campaign
            switch (conditionSelected) {
                case 'ALL-DEVICES':
                    return getIsStageValid(campaign, uiState, 'dateAndTime')
                case 'ALL':
                case 'ANY':
                    return (
                        segmentIds.length > 0 &&
                        getIsStageValid(campaign, uiState, 'dateAndTime')
                    )
                default:
                    return false
            }
        default:
            return false
    }
}
// Reports

export const getFormattedReport = (state: State) =>
    reportsSelector.getFormattedReport(state.reports)

export const getReportHasNextPage = (state: State) =>
    reportsSelector.getReportHasNextPage(state.reports)
export const getReportHasPreviousPage = (state: State) =>
    reportsSelector.getReportHasPreviousPage(state.reports)
export const getReportStartCursor = (state: State) =>
    reportsSelector.getReportStartCursor(state.reports)
export const getReportEndCursor = (state: State) =>
    reportsSelector.getReportEndCursor(state.reports)

/// <reference path="../../../typings/index.d.ts"/>

import { combineReducers } from 'redux'

import activePopover, * as activePopoverSelector from './activePopover'
import audience, * as audienceSelector from './audience'
import error, * as errorSelector from './error'
import form, * as formSelector from './form'
import home, * as homeSelector from './home'
import notification, * as notificationSelector from './notification'
import notificationDelivery, * as notificationDeliverySelector from './notificationDelivery'
import overview, * as overviewSelector from './overview'
import wizardModal, * as wizardModalSelector from './wizardModal'

export default combineReducers({
    activePopover,
    audience,
    error,
    form,
    home,
    notification,
    notificationDelivery,
    overview,
    wizardModal
})
// Audience
export const getAudience = (state: AppState) =>
    audienceSelector.getAudience(state.audience)

export const getTotalAudienceSize = (state: AppState) =>
    audienceSelector.getTotalAudienceSize(state.audience)

// Home
export const getIsCreatingCampaign = (state: AppState) =>
    homeSelector.getIsCreatingCampaign(state.home)

export const getIsFetching = (state: AppState) =>
    homeSelector.getIsFetching(state.home)

export const getIsNewCampaignPopoverOpen = (state: AppState) =>
    homeSelector.getIsNewCampaignPopoverOpen(state.home)

export const getIsNewCampaignPopoverClosing = (state: AppState) =>
    homeSelector.getIsNewCampaignPopoverClosing(state.home)

export const getIsCampaignTypeSelectorOpen = (state: AppState) =>
    homeSelector.getIsCampaignTypeSelectorOpen(state.home)

export const getIsCampaignTypeSelectorClosing = (state: AppState) =>
    homeSelector.getIsCampaignTypeSelectorClosing(state.home)

export const getIsNotificationDeliveryModalOpen = (state: AppState) =>
    notificationDeliverySelector.getIsNotificationDeliveryModalOpen(
        state.notificationDelivery
    )

export const getLastViewPage = (state: AppState) =>
    notificationDeliverySelector.getLastViewPage(state.notificationDelivery)

export const getAlertOptionHoverValue = (state: AppState) =>
    notificationSelector.getAlertOptionHoverValue(state.notification)

export const getIsAlertOptionsOpen = (state: AppState) =>
    notificationSelector.getIsAlertOptionsOpen(state.notification)

export const getIsOverviewModalOpen = (state: AppState) =>
    overviewSelector.getIsOverviewModalOpen(state.overview)

export const getIsSendTestModalOpen = (state: AppState) =>
    overviewSelector.getIsSendTestModalOpen(state.overview)

export const getTriggeredAnimation = (state: AppState) =>
    overviewSelector.getTriggeredAnimation(state.overview)

export const getIsTapBehaviorSelectorOpen = (state: AppState) =>
    notificationSelector.getIsTapBehaviorSelectorOpen(state.notification)

export const getIsTapBehaviorWebsitePresentationOpen = (state: AppState) =>
    notificationSelector.getIsTapBehaviorWebsitePresentationOpen(
        state.notification
    )

export const getIsError = (state: AppState) =>
    errorSelector.getIsError(state.error)

export const getIsPopoverModalFormOpen = (state: AppState) =>
    activePopoverSelector.getIsPopoverModalFormOpen(state.activePopover)

export const getActivePopover = (state: AppState) =>
    activePopoverSelector.getActivePopover(state.activePopover)

// Form
export const getCurrentFormPage = (state: AppState) =>
    formSelector.getCurrentPage(state.form)

export const getShouldShowPhonePreview = (state: AppState) =>
    formSelector.getShouldShowPhonePreview(state.form)

export const getIsAudienceSizeUpdating = (state: AppState) =>
    formSelector.getIsAudienceSizeUpdating(state.form)

// Wizard
export const getCurrentWizard = (state: AppState) =>
    wizardModalSelector.getCurrentWizard(state.wizardModal)

export const getIsWizardModalOpen = (state: AppState) =>
    wizardModalSelector.getIsWizardModalOpen(state.wizardModal)

export const getIsWizardModalClosing = (state: AppState) =>
    wizardModalSelector.getIsWizardModalClosing(state.wizardModal)

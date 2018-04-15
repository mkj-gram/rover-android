/// <reference path="../../../typings/index.d.ts"/>

import { combineReducers } from 'redux'

import home, * as homeSelector from './home'
import notificationDelivery, * as notificationDeliverySelector from './notificationDelivery'
import notification, * as notificationSelector from './notification'
import overview, * as overviewSelector from './overview'
import error, * as errorSelector from './error'
import activePopover, * as activePopoverSelector from './activePopover'

export default combineReducers({
    notification,
    home,
    notificationDelivery,
    overview,
    error,
    activePopover
})

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

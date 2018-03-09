/// <reference path="../../../typings/index.d.ts"/>

import { combineReducers } from 'redux'

import home, * as homeSelector from './home'
import notificationDelivery, * as notificationDeliverySelector from './notificationDelivery'
import notification, * as notificationSelector from './notification'

export default combineReducers({ notification, home, notificationDelivery })

export const getIsCreatingCampaign = (state: AppState) =>
    homeSelector.getIsCreatingCampaign(state.home)

export const getIsFetching = (state: AppState) =>
    homeSelector.getIsFetching(state.home)

export const getIsNewCampaignPopoverOpen = (state: AppState) =>
    homeSelector.getIsNewCampaignPopoverOpen(state.home)

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

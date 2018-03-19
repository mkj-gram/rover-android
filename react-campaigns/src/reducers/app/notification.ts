/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const alertOptionsHoverValue = (state = '', action: AnyAction) => {
    if (action.type === 'SET_HOVER_OPTION') {
        return action.hover
    }
    return state
}

const isAlertOptionsOpen = (state = '', action: AnyAction) => {
    switch (action.type) {
        case 'SET_ALERT_OPTIONS_MODAL_OPEN':
        case 'SET_ALERT_OPTIONS_MODAL_CLOSING':
        case 'SET_ALERT_OPTIONS_MODAL_CLOSED':
            return action.deviceInfoSelected
        default:
            return state
    }
}

const isTapBehaviorSelectorOpen = (state = 'close', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_TAP_BEHAVIOR_SELECTOR':
            return 'open'
        case 'CLOSE_TAP_BEHAVIOR_SELECTOR':
            return 'close'
        case 'CLOSING_TAP_BEHAVIOR_SELECTOR':
            return 'closing'
        default:
            return state
    }
}

const isTapBehaviorWebsitePresentationOpen = (
    state = 'close',
    action: AnyAction
) => {
    switch (action.type) {
        case 'OPEN_TAP_BEHAVIOR_WEBSITE_PRESENTATION':
            return 'open'
        case 'CLOSE_TAP_BEHAVIOR_WEBSITE_PRESENTATION':
            return 'close'
        case 'CLOSING_TAP_BEHAVIOR_WEBSITE_PRESENTATION':
            return 'closing'
        default:
            return state
    }
}

export default combineReducers({
    alertOptionsHoverValue,
    isAlertOptionsOpen,
    isTapBehaviorSelectorOpen,
    isTapBehaviorWebsitePresentationOpen
})

export const getAlertOptionHoverValue = (state: NotificationState) =>
    state.alertOptionsHoverValue

export const getIsAlertOptionsOpen = (state: NotificationState) =>
    state.isAlertOptionsOpen

export const getIsTapBehaviorSelectorOpen = (state: NotificationState) =>
    state.isTapBehaviorSelectorOpen

export const getIsTapBehaviorWebsitePresentationOpen = (
    state: NotificationState
) => state.isTapBehaviorWebsitePresentationOpen

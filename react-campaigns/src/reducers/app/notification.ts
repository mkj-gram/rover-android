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

export default combineReducers({
    alertOptionsHoverValue,
    isAlertOptionsOpen
})

export const getAlertOptionHoverValue = (state: AlertOptionsHoverState) =>
    state.alertOptionsHoverValue

export const getIsAlertOptionsOpen = (state: AlertOptionsHoverState) =>
    state.isAlertOptionsOpen

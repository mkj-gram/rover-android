/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const alertOptionsHoverValue = (state = '', action: AnyAction) => {
    if (action.type === 'SET_HOVER_OPTION') {
        return action.hover
    }
    return state
}

export default combineReducers({
    alertOptionsHoverValue
})

export const getAlertOptionHoverValue = (state: AlertOptionsHoverState) =>
    state.alertOptionsHoverValue

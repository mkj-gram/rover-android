/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const isOverviewModalOpen = (state = 'open', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_OVERVIEW_MODAL':
            return 'open'
        case 'CLOSING_OVERVIEW_MODAL':
            return 'close'
        case 'CLOSED_OVERVIEW_MODAL':
            return 'closed'
        default:
            return state
    }
}

const isSendTestModalOpen = (state = 'open', action: AnyAction) => {
    switch (action.type) {
        case 'SET_SEND_TEST_MODAL_OPEN':
            return 'open'
        case 'SET_SEND_TEST_MODAL_CLOSE':
            return 'close'
        default:
            return state
    }
}

const triggeredAnimation = (state = '', action: AnyAction) => {
    switch (action.type) {
        case 'TRIGGERED_ANIMATION':
            return action.trigger
        default:
            return state
    }
}

export default combineReducers({
    isOverviewModalOpen,
    isSendTestModalOpen,
    triggeredAnimation
})

export const getIsOverviewModalOpen = (state: OverviewModalState) =>
    state.isOverviewModalOpen

export const getIsSendTestModalOpen = (state: OverviewModalState) =>
    state.isSendTestModalOpen

export const getTriggeredAnimation = (state: OverviewModalState) =>
    state.triggeredAnimation

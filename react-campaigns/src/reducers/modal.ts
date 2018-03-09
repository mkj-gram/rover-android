/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: StringMap<string | boolean> = {
        overviewContainerAnimation: 'fade',
        overviewModalDisplay: 'open',
        overviewModalDisplayReset: false,
        sendTestModalDisplay: 'open',
        deviceInfoSelected: ''
    },
    action: AnyAction
): StringMap<string | boolean> | null => {
    let tempState = {
        ...state,
        overviewModalDisplayReset: false
    }
    if (action.type === 'SET_OVERVIEW_MODAL_CLOSE') {
        return {
            ...tempState,
            overviewModalDisplay: 'close',
            overviewContainerAnimation: 'fadeOut'
        }
    } else if (action.type === 'SET_OVERVIEW_MODAL_OPEN') {
        return {
            ...tempState,
            overviewModalDisplay: 'open',
            overviewContainerAnimation: 'fade'
        }
    } else if (action.type === 'SET_OVERVIEW_MODAL_NO_ANIMATION') {
        return {
            ...tempState,
            overviewModalDisplay: 'none'
        }
    } else if (action.type === 'SET_OVERVIEW_MODAL_RESET') {
        return {
            ...tempState,
            overviewModalDisplayReset: true,
            overviewModalDisplay: 'open',
            overviewContainerAnimation: 'fade'
        }
    } else if (action.type === 'SET_SEND_TEST_MODAL_OPEN') {
        return {
            ...tempState,
            sendTestModalDisplay: 'open'
        }
    } else if (action.type === 'SET_SEND_TEST_MODAL_CLOSE') {
        return {
            ...tempState,
            sendTestModalDisplay: 'close'
        }
    } else if (
        action.type === 'SET_ALERT_OPTIONS_MODAL_OPEN' ||
        action.type === 'SET_ALERT_OPTIONS_MODAL_CLOSING' ||
        action.type === 'SET_ALERT_OPTIONS_MODAL_CLOSED'
    ) {
        return {
            ...tempState,
            deviceInfoSelected: action.deviceInfoSelected
        }
    }
    return state
}

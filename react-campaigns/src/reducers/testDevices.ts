/// <reference path="../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const testDevices = (
    state: StringMap<string> = {},
    action: AnyAction
): StringMap<string> | null => {
    if (action.type === 'FETCH_TEST_DEVICES_SUCCESS') {
        return {
            ...action.testDevices
        }
    }
    return state
}

const selectedTestDevices = (
    state: string[] = [],
    action: AnyAction
): string[] => {
    if (action.type === 'UPDATE_SELECTED_TEST_DEVICES') {
        return action.deviceIds
    }
    return state
}

export default combineReducers({
    testDevices,
    selectedTestDevices
})

export const getSelectedTestDevices = (state: TestDeviceState) =>
    state.selectedTestDevices

export const getTestDevices = (state: TestDeviceState) => state.testDevices

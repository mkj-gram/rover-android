/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
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

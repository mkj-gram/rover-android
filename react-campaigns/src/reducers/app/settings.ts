/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const isPhonePreviewOpen = (state = false, action: AnyAction): boolean => {
    switch (action.type) {
        case 'OPEN_SETTINGS_PAGE_PHONE_PREVIEW':
            return true
        case 'CLOSE_SETTINGS_PAGE_PHONE_PREVIEW':
            return false
        default:
            return state
    }
}

export default combineReducers({
    isPhonePreviewOpen
})

export const getShouldShowPhonePreview = (state: SettingsState) =>
    state.isPhonePreviewOpen

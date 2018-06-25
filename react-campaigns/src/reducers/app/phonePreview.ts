/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const activePhonePreview = (state = '', action: AnyAction): string => {
    if (action.type === 'UPDATE_ACTIVE_PHONE_PREVIEW') {
        return action.preview
    }
    return state
}

const isPhonePreviewClosing = (state = false, action: AnyAction) => {
    if (action.type === 'START_CLOSING_PHONE_PREVIEW') {
        return true
    }

    if (
        action.type === 'UPDATE_ACTIVE_PHONE_PREVIEW' &&
        action.preview === ''
    ) {
        return false
    }

    return state
}

export default combineReducers({
    activePhonePreview,
    isPhonePreviewClosing
})

export const getIsPhonePreviewActive = (
    state: PhonePreviewState,
    preview: string
): boolean => state.activePhonePreview === preview

export const getIsPhonePreviewClosing = (state: PhonePreviewState) =>
    state.isPhonePreviewClosing

/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const currentPage = (state = '', action: AnyAction) =>
    action.type === 'UPDATE_CURRENT_PAGE' ? action.currentPage : state

const isAudienceSizeUpdating = (state = false, action: AnyAction): boolean => {
    switch (action.type) {
        case 'FETCH_AUDIENCE_SIZE_REQUEST':
            return true
        case 'FETCH_AUDIENCE_SIZE_FAILURE':
        case 'FETCH_AUDIENCE_SIZE_SUCCESS':
            return false
        default:
            return state
    }
}

export default combineReducers({
    currentPage,
    isAudienceSizeUpdating
})

export const getCurrentPage = (state: FormState) => state.currentPage

export const getShouldShowPhonePreview = (state: FormState) => {
    const formsWithPreview = ['messageAndMedia', 'alertOptions', 'tapBehavior']

    return formsWithPreview.includes(getCurrentPage(state))
}

export const getIsAudienceSizeUpdating = (state: FormState): boolean =>
    state.isAudienceSizeUpdating

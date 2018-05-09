/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const currentPage = (state = '', action: AnyAction) =>
    action.type === 'UPDATE_CURRENT_PAGE' ? action.currentPage : state

export default combineReducers({
    currentPage
})

export const getCurrentPage = (state: FormState) => state.currentPage

export const getShouldShowPhonePreview = (state: FormState) => {
    const formsWithPreview = ['messageAndMedia', 'alertOptions']

    return formsWithPreview.includes(getCurrentPage(state))
}

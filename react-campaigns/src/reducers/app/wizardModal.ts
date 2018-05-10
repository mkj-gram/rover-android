/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const currentWizard = (state = '', action: AnyAction) => {
    switch (action.type) {
        case 'START_OPENING_WIZARD_MODAL':
            return action.stateType
        case 'FINISH_CLOSING_WIZARD_MODAL':
            return ''
        default:
            return state
    }
}

const isWizardModalOpen = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'FINISH_OPENING_WIZARD_MODAL':
            return true
        case 'FINISH_CLOSING_WIZARD_MODAL':
            return false
        default:
            return state
    }
}

const isWizardModalClosing = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'START_CLOSING_WIZARD_MODAL':
            return true
        case 'FINISH_CLOSING_WIZARD_MODAL':
            return false
        default:
            return state
    }
}

export default combineReducers({
    currentWizard,
    isWizardModalOpen,
    isWizardModalClosing
})

export const getCurrentWizard = (state: WizardModal) => state.currentWizard

export const getIsWizardModalOpen = (state: WizardModal) =>
    state.isWizardModalOpen

export const getIsWizardModalClosing = (state: WizardModal) =>
    state.isWizardModalClosing

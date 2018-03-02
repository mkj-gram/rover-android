/// <reference path="../../../typings/index.d.ts"/>

import { AnyAction, combineReducers } from 'redux'

const isCreatingCampaign = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'CREATE_CAMPAIGNS_REQUEST':
            return true
        case 'CREATE_CAMPAIGNS_SUCCESS':
        case 'CREATE_CAMPAIGNS_FAILURE':
        default:
            return state
    }
}

const isFetching = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'FETCH_CAMPAIGNS_REQUEST':
            return true
        case 'FETCH_CAMPAIGNS_SUCCESS':
        case 'FETCH_CAMPAIGNS_FAILURE':
        default:
            return state
    }
}

const isNewCampaignPopoverOpen = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_NEW_CAMPAIGN_POPOVER':
            return true
        case 'CLOSE_NEW_CAMPAIGN_POPOVER':
            return false
        default:
            return state
    }
}

const isCampaignTypeSelectorOpen = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_CAMPAIGN_TYPE_SELECTOR':
        case 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR':
            return true
        case 'CLOSE_CAMPAIGN_TYPE_SELECTOR':
            return false
        default:
            return state
    }
}

const isCampaignTypeSelectorClosing = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR':
            return true
        case 'OPEN_CAMPAIGN_TYPE_SELECTOR':
        case 'CLOSE_CAMPAIGN_TYPE_SELECTOR':
            return false
        default:
            return state
    }
}

export default combineReducers({
    isCreatingCampaign,
    isFetching,
    isNewCampaignPopoverOpen,
    isCampaignTypeSelectorOpen,
    isCampaignTypeSelectorClosing
})

export const getIsCreatingCampaign = (state: HomeState) =>
    state.isCreatingCampaign

export const getIsFetching = (state: HomeState) => state.isFetching

export const getIsNewCampaignPopoverOpen = (state: HomeState) =>
    state.isNewCampaignPopoverOpen

export const getIsCampaignTypeSelectorOpen = (state: HomeState) =>
    state.isCampaignTypeSelectorOpen

export const getIsCampaignTypeSelectorClosing = (state: HomeState) =>
    state.isCampaignTypeSelectorClosing

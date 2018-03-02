/// <reference path="../../../typings/index.d.ts"/>

import { combineReducers } from 'redux'

import home, * as homeSelector from './home'

export default combineReducers({ home })

export const getIsCreatingCampaign = (state: AppState) =>
    homeSelector.getIsCreatingCampaign(state.home)

export const getIsFetching = (state: AppState) =>
    homeSelector.getIsFetching(state.home)

export const getIsNewCampaignPopoverOpen = (state: AppState) =>
    homeSelector.getIsNewCampaignPopoverOpen(state.home)

export const getIsCampaignTypeSelectorOpen = (state: AppState) =>
    homeSelector.getIsCampaignTypeSelectorOpen(state.home)

export const getIsCampaignTypeSelectorClosing = (state: AppState) =>
    homeSelector.getIsCampaignTypeSelectorClosing(state.home)

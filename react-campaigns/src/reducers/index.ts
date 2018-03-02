/// <reference path="../../typings/index.d.ts" />

import { combineReducers, AnyAction } from 'redux'

import app, * as appSelector from './app'
import campaigns, * as campaignsSelector from './campaigns'
import testDevices from './testDevices'
import modal from './modal'
export default combineReducers({
    app,
    campaigns,
    testDevices,
    modal
})

// App
export const getIsCreatingCampaign = (state: State) =>
    appSelector.getIsCreatingCampaign(state.app)

export const getIsFetching = (state: State) =>
    appSelector.getIsFetching(state.app)

export const getIsNewCampaignPopoverOpen = (state: State) =>
    appSelector.getIsNewCampaignPopoverOpen(state.app)

export const getIsCampaignTypeSelectorOpen = (state: State) =>
    appSelector.getIsCampaignTypeSelectorOpen(state.app)

export const getIsCampaignTypeSelectorClosing = (state: State) =>
    appSelector.getIsCampaignTypeSelectorClosing(state.app)

// Campaigns
export const getCampaign = (state: State, id: string) =>
    campaignsSelector.getCampaign(state.campaigns, id)

export const getAllCampaigns = (state: State) =>
    campaignsSelector.getAllCampaigns(state.campaigns)

export const getFilteredCampaigns = (state: State, filter: CampaignStatus) =>
    campaignsSelector.getFilteredCampaigns(state.campaigns, filter)

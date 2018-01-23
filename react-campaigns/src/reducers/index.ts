/// <reference path="../../typings/index.d.ts" />

import { combineReducers, AnyAction } from 'redux'

import campaigns, * as campaignsSelector from './campaigns'
export default combineReducers({
    campaigns
})

export const getCampaign = (state: State, id: string) =>
    campaignsSelector.getCampaign(state.campaigns, id)

export const getAllCampaigns = (state: State) => campaignsSelector.getAllCampaigns(state.campaigns)

export const getFilteredCampaigns = (state: State, filter: CampaignStatus) =>
    campaignsSelector.getFilteredCampaigns(state.campaigns, filter)

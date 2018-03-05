/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: StringMap<Campaign> = {},
    action: AnyAction
): StringMap<Campaign> | null => {
    if (action.campaigns) {
        return {
            ...action.campaigns
        }
    }
    return state
}

export const getCampaign = (state: StringMap<Campaign>, id: string) =>
    state[id] || null

export const getAllCampaigns = (
    state: StringMap<Campaign>
): Array<Campaign> => {
    if (state && state.campaigns) {
        return Object.keys(state).map(id => getCampaign(state, id))
    }
    return []
}

export const getFilteredCampaigns = (
    state: StringMap<Campaign>,
    filter: string
) => {
    const allCampaigns = getAllCampaigns(state)
    switch (filter) {
        case 'drafts':
            return allCampaigns.filter(e => e.campaignStatus === 'DRAFT')
        case 'published':
            return allCampaigns.filter(e => e.campaignStatus === 'PUBLISHED')
        case 'archived':
            return allCampaigns.filter(e => e.campaignStatus === 'ARCHIVED')
        default:
            throw new Error(`Unknown filter: ${filter}`)
    }
}

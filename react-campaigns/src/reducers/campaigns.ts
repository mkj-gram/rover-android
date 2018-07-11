/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../views/utils/getCampaignType'

import { formatDisplayTime, formatDate } from '../views/utils/formatDateTime'
import { getExperience } from './experiences'

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

export const getDisplayTime = (campaign: Campaign, timeField: string) => {
    let time
    if (isScheduledCampaign(campaign)) {
        time = campaign[timeField as 'scheduledTime']
    }

    if (isAutomatedNotificationCampaign(campaign)) {
        // ToDO
    }
    return formatDisplayTime(time)
}

export const getFormatDate = (campaign: Campaign, dateField: string) => {
    let date
    if (isScheduledCampaign(campaign)) {
        date = campaign[dateField as 'scheduledDate']
    }

    if (isAutomatedNotificationCampaign(campaign)) {
        // ToDO
    }
    return formatDate(date)
}

export const getDuplicateCampaignName = (campaign: Campaign) => {
    const { name } = campaign
    const duplicatedCampaignRegEx = /copy\s?\d*$/

    if (!duplicatedCampaignRegEx.exec(name)) {
        return `${name} copy`
    } else {
        const copyNumber = /\d*$/.exec(name)[0]
        if (!copyNumber) {
            return `${name} 2`
        } else {
            const newCopyNumber = (parseInt(copyNumber, 10) + 1).toString()
            return name.replace(/\d*$/, newCopyNumber)
        }
    }
}
export const getCampaignExists = (
    state: StringMap<Campaign>,
    id: string
): boolean => getCampaign(state, id) !== null

export const getExperiencePreviewURL = (state: State, id: string): string => {
    const { experienceId } = getCampaign(state.campaigns, id) as
        | ScheduledCampaign
        | AutomatedNotificationCampaign
    if (experienceId) {
        const experience = getExperience(state.experiences, experienceId)[0]
        if (experience) {
            return experience.simulatorURL
        }
    }
    return ''
}

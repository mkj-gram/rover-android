/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'
import { getCampaign } from './'

const isEqual = require('lodash/isEqual')

export default (
    state: ScheduledCampaign | AutomatedNotificationCampaign = null,
    action: AnyAction
): ScheduledCampaign | AutomatedNotificationCampaign | null => {
    if (action.editableCampaign) {
        return {
            ...action.editableCampaign
        }
    }
    return state
}

export const shouldCreateEditableCampaign = (
    state: ScheduledCampaign | AutomatedNotificationCampaign
) => state === null

export const getEditableCampaign = (state: State) => state.editableCampaign

export const getShouldShowSaveAndClose = (state: State) => {
    const { editableCampaign } = state
    const { campaignId } = editableCampaign

    const campaign = getCampaign(state, campaignId)

    const { name: campaignName, UIState, ...campaignFields } = campaign
    const {
        name: editableCampaignName,
        ...editableCampaignFields
    } = editableCampaign

    return !isEqual(editableCampaignFields, campaignFields)
}

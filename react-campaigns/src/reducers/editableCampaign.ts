/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'
import { getCampaign } from './'
import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../views/utils/getCampaignType'

import { getIsStageValid, getCurrentWizard } from './index'

import { formatDisplayTime, formatDate } from '../views/utils/formatDateTime'

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

const getIsSegmentConditionUpdated = (state: State): boolean => {
    const { editableCampaign, editableUIState } = state
    const { campaignId } = editableCampaign
    const { audience } = editableUIState
    const { conditionSelected } = audience

    const campaign = getCampaign(state, campaignId)
    const { UIState } = campaign

    if (UIState.length < 1) {
        return false
    }

    const currentAudience = JSON.parse(UIState).audience

    if (conditionSelected && !isEqual(audience, currentAudience)) {
        return true
    }

    return false
}

export const getEditableCampaign = (state: State) => state.editableCampaign

export const getShouldShowSaveAndClose = (state: State) => {
    const { editableCampaign, editableUIState } = state
    const { campaignId } = editableCampaign

    const campaign = getCampaign(state, campaignId)

    const { name: campaignName, UIState, ...campaignFields } = campaign
    const {
        name: editableCampaignName,
        ...editableCampaignFields
    } = editableCampaign

    const nextTriggeredShowSaveAndClose = () =>
        Object.keys(editableUIState).some(
            (page: keyof editableUIState) =>
                editableUIState[page].seen &&
                ((UIState as string).length === 0 ||
                    !JSON.parse(UIState as string)[page].seen)
        )

    const isPublishedCampaignSettingsValid = () => {
        if (editableCampaign.campaignStatus !== 'PUBLISHED') {
            return true
        }
        const currentWizard = getCurrentWizard(state) as formPage

        return getIsStageValid(editableCampaign, editableUIState, currentWizard)
    }

    if (!isPublishedCampaignSettingsValid()) {
        return false
    }

    return (
        !isEqual(editableCampaignFields, campaignFields) ||
        nextTriggeredShowSaveAndClose() ||
        getIsSegmentConditionUpdated(state)
    )
}

export const getDisplayTime = (state: State, timeField: string) => {
    const { editableCampaign } = state
    let time
    if (isScheduledCampaign(editableCampaign)) {
        time = editableCampaign[timeField as 'scheduledTime']
    }

    if (isAutomatedNotificationCampaign(editableCampaign)) {
        // ToDO
    }

    return formatDisplayTime(time)
}

export const getFormatDate = (state: State, dateField: string) => {
    const { editableCampaign } = state
    let date
    if (isScheduledCampaign(editableCampaign)) {
        date = editableCampaign[dateField as 'scheduledDate']
    }

    if (isAutomatedNotificationCampaign(editableCampaign)) {
        // ToDO
    }

    return formatDate(date)
}

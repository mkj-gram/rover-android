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

    return (
        !isEqual(editableCampaignFields, campaignFields) ||
        nextTriggeredShowSaveAndClose()
    )
}

export const getDisplayTime = (state: State) => {
    const { editableCampaign } = state
    const { scheduledTime } = editableCampaign as ScheduledCampaign

    let minutes = Math.floor(scheduledTime / 60) % 60
    let hours = Math.floor(scheduledTime / 3600) % 3600
    let period = scheduledTime - 12 * 3600 < 0 ? 'AM' : 'PM'

    return `${hours === 0 || hours === 12 ? 12 : hours % 12}:${
        minutes.toString().length === 1 ? `0${minutes}` : minutes
    } ${period}`
}

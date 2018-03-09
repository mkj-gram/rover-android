/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

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

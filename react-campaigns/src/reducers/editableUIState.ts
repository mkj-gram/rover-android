/// <reference path="../../typings/index.d.ts"/>

import { AnyAction } from 'redux'

export default (
    state: editableUIState | {} = {},
    action: AnyAction
): editableUIState | {} => {
    if (action.editableUIState) {
        return { ...action.editableUIState }
    }
    return state
}

export const getEditableUIState = (state: State) => state.editableUIState

export const getIsStageValid = (
    state: State,
    stage: keyof editableUIState
): boolean => {
    const { editableCampaign } = state
    switch (stage) {
        // Notification Settings
        case 'messageAndMedia':
            const { notificationBody } = editableCampaign
            return notificationBody !== ''
        case 'alertOptions':
            return (
                (editableCampaign.notificationAlertOptionPushNotification ||
                    editableCampaign.notificationAlertOptionNotificationCenter) &&
                getIsStageValid(state, 'messageAndMedia')
            )
        case 'tapBehavior':
            const {
                notificationTapBehaviorType,
                notificationTapBehaviorUrl
            } = editableCampaign

            if (!getIsStageValid(state, 'alertOptions')) {
                return false
            }

            switch (notificationTapBehaviorType) {
                case 'OPEN_APP':
                case 'OPEN_EXPERIENCE':
                    return true
                case 'OPEN_DEEP_LINK':
                case 'OPEN_WEBSITE':
                    return notificationTapBehaviorUrl !== ''
                default:
                    return false
            }
        case 'advancedSettings':
            return getIsStageValid(state, 'tapBehavior')

        // Scheduled Delivery Settings
        case 'dateAndTime':
            const {
                scheduledType,
                scheduledDate,
                scheduledTime
            } = editableCampaign as ScheduledCampaign
            switch (scheduledType) {
                case 'NOW':
                    return true
                case 'SCHEDULED':
                    return scheduledDate !== null && scheduledTime !== null
                default:
                    return false
            }
        case 'audience':
            const { audience } = getEditableUIState(state)
            const { conditionSelected } = audience
            if (conditionSelected) {
                return getIsStageValid(state, 'dateAndTime')
            }
            return false
        default:
            return false
    }
}

export const getTypeProgress = (state: State, type: UIStateType): number => {
    const { editableUIState } = state
    const fields = Object.keys(editableUIState).filter(
        (field: keyof editableUIState) =>
            (editableUIState[field] as UIStateField).type === type
    )

    return (
        fields
            .filter(
                (field: keyof editableUIState) =>
                    (editableUIState[field] as UIStateField).seen
            )
            .filter((field: keyof editableUIState) =>
                getIsStageValid(state, field)
            ).length *
        100 /
        fields.length
    )
}

export const getTotalProgress = (state: State): number => {
    const { editableUIState } = state
    const UIStateTypes = new Set(
        Object.keys(editableUIState).map(
            (field: keyof editableUIState) =>
                (editableUIState[field] as UIStateField).type
        )
    )
    const validTypes = Array.from(UIStateTypes).filter(
        (field: UIStateType) => getTypeProgress(state, field) === 100
    )

    return 100 * validTypes.length / UIStateTypes.size
}

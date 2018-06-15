/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: AudienceState = {},
    action: AnyAction
): AudienceState => {
    if (action.audience) {
        return action.audience
    }
    return state
}

export const getAudience = (state: AudienceState) => state

export const getTotalAudienceSize = (state: AudienceState) =>
    state.totalSize || 0

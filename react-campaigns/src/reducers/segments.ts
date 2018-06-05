/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: StringMap<string> = {},
    action: AnyAction
): StringMap<string> => {
    if (action.segments) {
        return {
            ...action.segments
        }
    }
    return state
}

export const getSegment = (
    state: StringMap<Segment>,
    segmentId: string
): Segment => state[segmentId] || null

export const getAllSegments = (state: StringMap<Segment>): Array<Segment> => {
    if (state && state.segments) {
        return Object.keys(state).map((segmentId: string) =>
            getSegment(state, segmentId)
        )
    }
}

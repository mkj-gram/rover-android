/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: Array<Experience> = [],
    action: AnyAction
): Array<Experience> | null => {
    if (action.experiences) {
        return [...state, ...action.experiences]
    }
    return state
}

export const getExperiences = (state: Array<Experience>) => state

export const getExperience = (state: Array<Experience>, id: string) =>
    state.filter(experience => experience.id === id)

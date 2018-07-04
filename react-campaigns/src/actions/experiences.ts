/// <reference path="../../typings/index.d.ts"/>

type ExperienceResponse = {
    id: string
    type: string
    attributes: ExperienceResponseAttributes
}
type ExperienceResponseAttributes = {
    name: string
    'view-token': string
    'has-unpublished-changes': boolean
    'is-published': boolean
    'is-archived': boolean
    'short-url': string
    'simulator-url': string
}

import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import handleError from '../Environment/handleError'
import { getToken } from '../Environment'

const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${getToken()}`
}
const options = {
    method: 'GET',
    headers
}

const env = process.env.NODE_ENV === 'production' ? '' : 'staging.'
const uri = `https://api.${env}rover.io/v1/experience-list-items/?filter[collectionType]=published&page[size]=150`

export const fetchExperiences: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (dispatch: Dispatch<State>) => {
    dispatch({ type: 'FETCH_EXPERIENCES_REQUEST' })
    return fetch(uri, options)
        .then(res => {
            if (!res.ok) {
                throw [{ message: res.status }]
            }
            return res
        })
        .then(res => res.json())
        .then(({ data }) => {
            const experiences: Array<Experience> = data.map(
                (experience: ExperienceResponse) => ({
                    id: experience.id,
                    name: experience.attributes.name,
                    simulatorURL: experience.attributes['simulator-url']
                })
            )
            return dispatch({
                type: 'FETCH_EXPERIENCES_SUCCESS',
                experiences
            })
        })
        .catch(errors =>
            handleError(
                'FETCH_EXPERIENCES_ERROR',
                dispatch,
                errors[0].message.toString()
            )
        )
}

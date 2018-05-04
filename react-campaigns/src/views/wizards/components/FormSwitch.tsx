/// <reference path="../../../../typings/index.d.ts" />
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Text, Switch, titanium } from '@rover/ts-bootstrap/dist/src'

import HoverTextInput from './HoverTextInput'

import { updateEditableCampaign } from '../../../actions'
import { getEditableCampaign } from '../../../reducers'

export interface FormSwitchProps {
    field: 'notificationIosContentAvailable'
    displayText: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    hoverable?: boolean
}

export interface FormSwitchDispatchProps {
    updateEditableCampaign: (val: object) => void
}

export interface FormSwitchStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const FormSwitch: React.SFC<
    FormSwitchProps & FormSwitchDispatchProps & FormSwitchStateProps
> = ({
    editableCampaign,
    displayText,
    field,
    hoverable,
    updateEditableCampaign
}) => {
    const handleUpdateSwitch = () => {
        updateEditableCampaign({
            [field]: !editableCampaign[field]
        })
    }

    const Fragment = React.Fragment

    const switchElem = (
        <div
            style={{
                width: '100%',
                display: 'flex',
                minHeight: 72,
                borderBottom: `1px solid ${titanium}`,
                position: 'relative',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            onClick={handleUpdateSwitch}
        >
            <Text text={displayText} size="large" />
            <Switch
                on={editableCampaign[field] as boolean}
                onClick={() => handleUpdateSwitch()}
            />
        </div>
    )
    if (hoverable) {
        return (
            <HoverTextInput description="" field={field}>
                {switchElem}
            </HoverTextInput>
        )
    } else {
        return switchElem
    }
}

const mapStateToProps = (state: State): FormSwitchStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): FormSwitchDispatchProps => {
    return {
        updateEditableCampaign: val => {
            dispatch(updateEditableCampaign(val))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormSwitch)

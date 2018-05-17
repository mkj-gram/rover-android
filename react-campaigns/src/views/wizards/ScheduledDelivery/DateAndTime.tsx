/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import * as moment from 'moment-timezone'

import {
    openPopoverModalForm,
    updateActivePopover,
    updateEditableCampaign
} from '../../../actions'
import {
    getActivePopover,
    getIsPopoverModalFormOpen,
    getEditableCampaign,
    getEditableUIState
} from '../../../reducers'

import {
    aquamarine,
    Button,
    PopoverContainer,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import PopoverTextRadioButtonComponent from '../../utils/PopoverTextRadioButtonComponent'
import MobilePopover from '../components/MobilePopover'

export interface DateAndTimeProps {
    device: Media
    wizardSection: keyof editableUIState
}

export interface DateAndTimeStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign
    editableUIState: editableUIState
    isPopoverModalFormOpen: string
}

export interface DateAndTimeDispatchProps {
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (x: object) => void
}

const DateAndTime: React.SFC<
    DateAndTimeProps & DateAndTimeStateProps & DateAndTimeDispatchProps
> = ({
    activePopover,
    device,
    editableCampaign,
    editableUIState,
    isPopoverModalFormOpen,
    updateActivePopover,
    updateEditableCampaign
}) => <div />

const mapStateToProps = (state: State): DateAndTimeStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
    editableUIState: getEditableUIState(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): DateAndTimeDispatchProps => {
    return {
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        updateEditableCampaign: (x: object) =>
            dispatch(updateEditableCampaign(x))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateAndTime)

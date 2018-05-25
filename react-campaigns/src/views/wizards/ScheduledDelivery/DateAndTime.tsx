/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'

import {
    openPopoverModalForm,
    updateActivePopover,
    updateEditableCampaign
} from '../../../actions'
import {
    getActivePopover,
    getIsPopoverModalFormOpen,
    getEditableCampaign,
    getEditableUIState,
    getCampaign
} from '../../../reducers'

import {
    aquamarine,
    Button,
    PopoverContainer,
    turquoise,
    Text,
    RadioButton
} from '@rover/ts-bootstrap/dist/src'

import PopoverTextRadioButtonComponent from '../../utils/PopoverTextRadioButtonComponent'
import MobilePopover from '../components/MobilePopover'
import FormSection from '../../utils/FormSection'
import Row from '../components/Row'

export interface DateAndTimeProps {
    device: Media
    wizardSection: keyof editableUIState
}

export interface DateAndTimeStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign
    editableUIState: editableUIState
    isPopoverModalFormOpen: string
    campaign: ScheduledCampaign
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
    updateEditableCampaign,
    campaign
}) => {
    const { Fragment } = React
    const {
        scheduledTimestamp,
        scheduledTimeZone,
        scheduledUseLocalDeviceTime
    } = campaign

    return (
        <Fragment>
            {/*Title */}
            <FormSection device={device} style={{ marginTop: 24 }}>
                <Text text="Date and Time" size="h1" />
            </FormSection>

            {/*When to deliver */}
            <FormSection device={device}>
                <Text
                    text="When should this notification be delivered?"
                    size="h2"
                />
                <Row
                    onClick={() =>
                        updateEditableCampaign({
                            scheduledType: 'NOW',
                            scheduledTimestamp,
                            scheduledTimeZone,
                            scheduledUseLocalDeviceTime
                        })
                    }
                >
                    <Text text="As soon as it's published" size="large" />
                    <RadioButton
                        selected={editableCampaign['scheduledType'] === 'NOW'}
                        style={{
                            outerStyle: { height: 18, width: 18 }
                        }}
                    />
                </Row>
                <Row
                    onClick={() =>
                        updateEditableCampaign({
                            scheduledType: 'SCHEDULED'
                        })
                    }
                >
                    <Text text="A scheduled date and time" size="large" />
                    <RadioButton
                        selected={
                            editableCampaign['scheduledType'] === 'SCHEDULED'
                        }
                        style={{
                            outerStyle: { height: 18, width: 18 }
                        }}
                    />
                </Row>
            </FormSection>
        </Fragment>
    )
}

const mapStateToProps = (state: State): DateAndTimeStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
    editableUIState: getEditableUIState(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state),
    campaign: getCampaign(
        state,
        parse(location.search.substring(1)).campaignId
    ) as ScheduledCampaign
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

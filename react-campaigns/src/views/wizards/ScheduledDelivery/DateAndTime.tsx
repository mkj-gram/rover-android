/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'

import { updateEditableCampaign } from '../../../actions'
import { getEditableCampaign, getCampaign } from '../../../reducers'

import { RadioButton, Switch, Text } from '@rover/ts-bootstrap/dist/src'

import FormSection from '../../utils/FormSection'
import Row from '../components/Row'
import TimezonePicker from './TimezonePicker'
import DatePickerContainer from './DatePickerContainer'

export interface DateAndTimeProps {
    device: Media
    wizardSection: keyof editableUIState
}

export interface DateAndTimeStateProps {
    editableCampaign: ScheduledCampaign
    campaign: ScheduledCampaign
}

export interface DateAndTimeDispatchProps {
    updateEditableCampaign: (x: object) => void
}

const DateAndTime: React.SFC<
    DateAndTimeProps & DateAndTimeStateProps & DateAndTimeDispatchProps
> = ({ device, editableCampaign, updateEditableCampaign, campaign }) => {
    const { Fragment } = React
    const {
        scheduledDate,
        scheduledTime,
        scheduledTimeZone,
        scheduledUseLocalDeviceTime
    } = campaign
    const {
        scheduledType,
        scheduledUseLocalDeviceTime: useLocalDeviceTime
    } = editableCampaign

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
                            scheduledDate,
                            scheduledTime,
                            scheduledTimeZone,
                            scheduledUseLocalDeviceTime
                        })
                    }
                >
                    <Text text="As soon as it's published" size="large" />
                    <RadioButton
                        selected={scheduledType === 'NOW'}
                        style={{
                            outerStyle: { height: 18, width: 18 }
                        }}
                    />
                </Row>
                <Row
                    onClick={() =>
                        updateEditableCampaign({
                            scheduledType: 'SCHEDULED',
                            scheduledTimeZone:
                                editableCampaign.scheduledTimeZone.length === 0
                                    ? Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone
                                    : editableCampaign.scheduledTimeZone
                        })
                    }
                >
                    <Text text="A scheduled date and time" size="large" />
                    <RadioButton
                        selected={scheduledType === 'SCHEDULED'}
                        style={{
                            outerStyle: { height: 18, width: 18 }
                        }}
                    />
                </Row>
            </FormSection>
            {scheduledType === 'SCHEDULED' && (
                <FormSection device={device}>
                    <Text text="Scheduled the delivery" size="h2" />
                    <DatePickerContainer
                        device={device}
                        field="scheduledDate"
                    />
                    <Row
                        onClick={() =>
                            updateEditableCampaign({
                                scheduledUseLocalDeviceTime: !useLocalDeviceTime
                            })
                        }
                    >
                        <Text text="Use local device time zone?" size="large" />
                        <Switch on={useLocalDeviceTime} onClick={() => null} />
                    </Row>
                    {!useLocalDeviceTime && <TimezonePicker device={device} />}
                </FormSection>
            )}
        </Fragment>
    )
}

const mapStateToProps = (state: State): DateAndTimeStateProps => ({
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
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
        updateEditableCampaign: (x: object) =>
            dispatch(updateEditableCampaign(x))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateAndTime)

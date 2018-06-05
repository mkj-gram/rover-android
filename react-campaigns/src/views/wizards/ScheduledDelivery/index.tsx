/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'

import Audience from './Audience'
import DateAndTime from './DateAndTime'
import Form from '../Form'
import { getCampaign, getIsWizardModalClosing } from '../../../reducers'
import { updateScheduledDeliverySettings } from '../../../actions'

export interface ScheduledDeliveryStateProps {
    campaign: Campaign
    isWizardModalClosing: boolean
}

export interface ScheduledDeliveryProps {
    device: Media
}

export interface ScheduledDeliveryDispatchProps {
    updateScheduledDeliverySettings: () => void
}

const ScheduledDelivery: React.SFC<
    ScheduledDeliveryProps &
        ScheduledDeliveryStateProps &
        ScheduledDeliveryDispatchProps
> = ({
    campaign,
    device,
    isWizardModalClosing,
    updateScheduledDeliverySettings
}) => {
    const { campaignId } = campaign
    const animation = isWizardModalClosing ? 'close' : 'open'

    const type: UIStateType = 'scheduleddelivery'

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'white',
                animation: `${animation} 500ms ease`
            }}
            id="scheduledDelivery"
        >
            <Form
                type={type}
                campaignId={campaignId}
                saveAndClose={updateScheduledDeliverySettings}
                device={device}
            >
                <DateAndTime device={device} wizardSection="dateAndTime" />
                <Audience device={device} wizardSection="audience" />
            </Form>
        </div>
    )
}

const mapStateToProps = (state: State): ScheduledDeliveryStateProps => ({
    campaign: getCampaign(
        state,
        parse(location.search.substring(1)).campaignId
    ),
    isWizardModalClosing: getIsWizardModalClosing(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): ScheduledDeliveryDispatchProps => {
    return {
        updateScheduledDeliverySettings: () =>
            dispatch(updateScheduledDeliverySettings())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledDelivery)

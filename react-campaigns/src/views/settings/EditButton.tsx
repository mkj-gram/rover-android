/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect } from 'react-redux'
import ResponsiveContainer from '../utils/ResponsiveContainer'

import {
    Button,
    turquoise,
    aquamarine,
    ChangeIcon,
    titanium
} from '@rover/ts-bootstrap/dist/src'
import { getEditableCampaign } from '../../reducers'
import { isScheduledCampaign } from '../utils/getCampaignType'

export interface EditButtonStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export type EditButtonProps = EditButtonStateProps & InjectedProps

const EditButton: React.SFC<EditButtonProps> = ({
    device,
    editableCampaign
}) => {
    if (
        editableCampaign &&
        isScheduledCampaign(editableCampaign) &&
        editableCampaign.scheduledDeliveryStatus === 'FINISHED'
    ) {
        return null
    }

    switch (device) {
        case 'Desktop':
            return (
                <Button
                    text="Edit"
                    type="regular"
                    mouseDownColors={{
                        active: turquoise,
                        inactive: aquamarine
                    }}
                />
            )
        case 'Tablet':
            return <ChangeIcon fill={titanium} />
        case 'Mobile':
        default:
            return null
    }
}

const mapStateToProps = (state: State): EditButtonStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

export default connect(
    mapStateToProps,
    {}
)((props: EditButtonProps) => ResponsiveContainer(props)(EditButton))

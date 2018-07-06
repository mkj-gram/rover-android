/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect } from 'react-redux'
import { getEditableCampaign } from '../../reducers'
import { Text } from '@rover/ts-bootstrap/dist/src'

export interface AlertOptionsLabelStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const AlertOptionsLabel: React.SFC<AlertOptionsLabelStateProps> = ({
    editableCampaign
}) => {
    const displayText: StringMap<alertType> = {
        'push notification': 'notificationAlertOptionPushNotification',
        'notification center': 'notificationAlertOptionNotificationCenter',
        'badge number': 'notificationAlertOptionBadgeNumber'
    }
    const activatedAlerts = Object.keys(displayText).filter(
        field => editableCampaign[displayText[field] as alertType]
    )

    const stringArr = activatedAlerts.toString()
    const lastComma = stringArr.lastIndexOf(',')
    let displayStr =
        stringArr.substr(0, lastComma) +
        (activatedAlerts.length > 1 ? ' and ' : '') +
        stringArr.substr(lastComma + 1)

    displayStr =
        displayStr.length > 0
            ? displayStr[0].toUpperCase() + displayStr.slice(1)
            : ''

    return (
        <Text
            text={displayStr}
            size="small"
            textStyle={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        />
    )
}

const mapStateToProps = (state: State): AlertOptionsLabelStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

export default connect(
    mapStateToProps,
    {}
)(AlertOptionsLabel)

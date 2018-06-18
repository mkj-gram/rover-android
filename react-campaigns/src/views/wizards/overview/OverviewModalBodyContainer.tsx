/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import ResponsiveContainer from '../../utils/ResponsiveContainer'
import OverviewModalRow from './OverviewModalRow'
import NotificationContainer from '../notification/NotificationContainer'
import ScheduledDelivery from '../ScheduledDelivery'

import { getCurrentWizard, getTypeProgress } from '../../../reducers'
import { openWizardModal } from '../../../actions'

export interface StateProps {
    currentWizard: UIStateType
    notificationProgress: number
    scheduledDeliveryProgress: number
}

export interface DispatchProps {
    openWizardModal: (stateType: UIStateType) => void
}

export type OverviewModalBodyContainerProps = {
    device: Media
}

const OverviewModalBodyContainer: React.SFC<
    OverviewModalBodyContainerProps & StateProps & DispatchProps
> = ({
    notificationProgress,
    currentWizard,
    scheduledDeliveryProgress,
    device,
    openWizardModal
}) => {
    const arr = [
        {
            name: 'Scheduled Delivery',
            text:
                // tslint:disable-next-line:max-line-length
                'Determine how and when the notification is delivered as well as which devices/users will receive it.',
            val: scheduledDeliveryProgress
        },
        {
            name: 'Notification',
            text:
                // tslint:disable-next-line:max-line-length
                'Compose the title and body of notification, add rich media and determine what happens when the user taps or swipes the notification.',
            val: notificationProgress
        }
    ]

    const openSelectedWizard = (wizard: UIStateType) => openWizardModal(wizard)
    return (
        <div
            style={{
                width: '100%',
                flex: 'auto',
                marginBottom: 80,
                overflowY: 'scroll'
            }}
        >
            {arr.map(row => (
                <OverviewModalRow
                    {...row}
                    device={device}
                    openWizard={openSelectedWizard}
                    key={row.name}
                />
            ))}
            {currentWizard === 'notification' &&
                ReactDOM.createPortal(
                    <NotificationContainer device={device} />,
                    document.getElementById('mainModalLeft')
                )}
            {currentWizard === 'scheduleddelivery' &&
                ReactDOM.createPortal(
                    <ScheduledDelivery device={device} />,
                    document.getElementById('mainModalLeft')
                )}
        </div>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    currentWizard: getCurrentWizard(state),
    notificationProgress: getTypeProgress(state, 'notification'),
    scheduledDeliveryProgress: getTypeProgress(state, 'scheduleddelivery')
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        openWizardModal: stateType => dispatch(openWizardModal(stateType))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OverviewModalBodyContainer)

/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import ResponsiveContainer from '../../utils/ResponsiveContainer'
import OverviewModalRow from './OverviewModalRow'
import NotificationContainer from '../notification/NotificationContainer'

import {
    getIsNotificationDeliveryModalOpen,
    getTypeProgress
} from '../../../reducers'
import { openNotificationDeliveryModal } from '../../../actions'

export interface StateProps {
    isNotificationDeliveryModalOpen: string
    notificationProgress: number
}

export interface DispatchProps {
    openNotificationDeliveryModal: (open: boolean) => void
}

export type OverviewModalBodyContainerProps = {
    deliveryComplete: number
    device: Media
}

export type OverviewModalBodyContainerState = {
    redirectPage: string
}

class OverviewModalBodyContainer extends React.Component<
    OverviewModalBodyContainerProps & StateProps & DispatchProps,
    OverviewModalBodyContainerState
> {
    constructor(
        props: OverviewModalBodyContainerProps & StateProps & DispatchProps
    ) {
        super(props)
        this.state = {
            redirectPage: ''
        }
        this.handlePageDirect = this.handlePageDirect.bind(this)
    }

    handlePageDirect(redirectPage: string) {
        this.setState(
            {
                redirectPage
            },
            () => this.props.openNotificationDeliveryModal(true)
        )
    }

    render() {
        const {
            notificationProgress,
            deliveryComplete,
            device,
            isNotificationDeliveryModalOpen
        } = this.props
        const arr = [
            {
                name: 'Notification',
                text:
                    // tslint:disable-next-line:max-line-length
                    'Compose the title and body of notification, add rich media and determine what happens when the user taps or swipes the notification.',
                val: notificationProgress
            },
            {
                name: 'Delivery',
                text:
                    // tslint:disable-next-line:max-line-length
                    'Determine how and when the notification is delivered as well as which devices/users will receive it.',
                val: deliveryComplete
            },
            {
                name: 'Experience',
                text:
                    // tslint:disable-next-line:max-line-length
                    'Customize and personalize the content of the experience that will be delivered when the user swipes or taps the notification.',
                val: 10
            }
        ]

        return (
            <div
                style={{
                    width: '100%',
                    flex: 'auto',
                    marginBottom: 80,
                    overflowY: 'scroll'
                }}
            >
                {arr.map(row => {
                    let injectedProps = {
                        name: row.name,
                        text: row.text,
                        val: row.val,
                        handlePageDirect: this.handlePageDirect
                    }
                    const RowContainer = ResponsiveContainer(injectedProps)(
                        OverviewModalRow
                    )
                    return <RowContainer key={row.name} />
                })}
                {isNotificationDeliveryModalOpen !== 'close' &&
                    ReactDOM.createPortal(
                        <NotificationContainer device={device} />,
                        document.getElementById('mainModalLeft')
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state: State): StateProps => ({
    notificationProgress: getTypeProgress(state, 'notification'),
    isNotificationDeliveryModalOpen: getIsNotificationDeliveryModalOpen(state)
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        openNotificationDeliveryModal: open => {
            dispatch(openNotificationDeliveryModal(open))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    OverviewModalBodyContainer
)

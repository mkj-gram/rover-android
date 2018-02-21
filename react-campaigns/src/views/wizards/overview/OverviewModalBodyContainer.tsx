/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import ResponsiveContainer from '../../utils/ResponsiveContainer'
import OverviewModalRow from './OverviewModalRow'

export type OverviewModalBodyContainerProps = {
    showExperience: boolean
    notificationComplete: number
    deliveryComplete: number
}

const OverviewModalBodyContainer: React.SFC<
    OverviewModalBodyContainerProps
> = ({ showExperience, notificationComplete, deliveryComplete }) => {
    const arr = [
        {
            name: 'Notification',
            text:
                // tslint:disable-next-line:max-line-length
                'Compose the title and body of notification, add rich media and determine what happens when the user taps or swipes the notification.',
            val: notificationComplete
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
            val: showExperience
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
                    val: row.val
                }
                const RowContainer = ResponsiveContainer(injectedProps)(
                    OverviewModalRow
                )
                return <RowContainer key={row.name} />
            })}
        </div>
    )
}

export default OverviewModalBodyContainer

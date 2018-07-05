/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { parse } from 'qs'
import DeviceTransitionContainer from '../utils/DeviceTransitionContainer'

import { InjectedProps } from '../utils/ResponsiveContainer'
import OverviewModalHeader from '../wizards/overview/OverviewModalHeader'
import NotificationStatistics from './NotificationStatistics'
import NotificationStatisticsGraph from './NotificationStatisticsGraph'

const NotificationOpenedReport: React.SFC<
    InjectedProps & RouteComponentProps<Location>
> = ({ device, location }) => {
    const { campaignId } = parse(location.search.substring(1))
    return (
        <DeviceTransitionContainer device={device}>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white'
                }}
            >
                <OverviewModalHeader campaignId={campaignId} device={device} />
                <NotificationStatisticsGraph
                    campaignId={campaignId}
                    device={device}
                />
                <NotificationStatistics
                    campaignId={campaignId}
                    device={device}
                />
            </div>
        </DeviceTransitionContainer>
    )
}

export default withRouter(NotificationOpenedReport)

/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { parse } from 'qs'
import { white } from '@rover/ts-bootstrap/dist/src'

import DeviceTransitionContainer from '../utils/DeviceTransitionContainer'

import { InjectedProps } from '../utils/ResponsiveContainer'
import OverviewModalHeader from '../wizards/overview/OverviewModalHeader'
import NotificationStatistics from './NotificationStatistics'
import NotificationStatisticsGraph from './NotificationStatisticsGraph'
import ReportPreview from './ReportPreview'

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
                    backgroundColor: white,
                    overflowX: 'scroll'
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
                {device === 'Desktop' &&
                    document.getElementById('phone-bezel') && (
                        <ReportPreview campaignId={campaignId} />
                    )}
            </div>
        </DeviceTransitionContainer>
    )
}

export default withRouter(NotificationOpenedReport)

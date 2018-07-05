/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { fetchReportConnection } from '../../actions'
import { getCampaign } from '../../reducers'

import { Statistic, Text } from '@rover/ts-bootstrap/dist/src'
import NotificationStatisticsPopover from './NotificationStatisticsPopover'
import StatDetail from './StatDetail'

export interface NotificationStatisticsProps {
    campaignId: string
    device: Media
}

export interface NotificationStatisticsStateProps {
    notificationOpenedReport: NotificationOpenedReport
    notificationDeliveredReport: NotificationDeliveredReport
}

const NotificationStatistics: React.SFC<
    NotificationStatisticsProps & NotificationStatisticsStateProps
> = ({
    campaignId,
    device,
    notificationDeliveredReport,
    notificationOpenedReport
}) => {
    const {
        totalDelivered,
        notificationCenterAttempted,
        notificationCenterDelivered,
        notificationCenterUnreachable,
        notificationCenterInvalid,
        pushAttempted,
        pushDelivered,
        pushUnreachable,
        pushInvalid
    } = notificationDeliveredReport
    const {
        total,
        unique,
        notificationCenterTotal,
        notificationCenterUnique,
        pushDirectTotal,
        pushDirectUnique,
        pushInfluencedTotal,
        pushInfluencedUnique
    } = notificationOpenedReport

    const getSuccessRate = (): number =>
        (100 * (notificationCenterDelivered + pushDelivered)) /
        (notificationCenterAttempted + pushAttempted)

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent:
                    device === 'Mobile' ? 'center' : 'space-between',
                flexWrap: 'wrap',
                padding: '24px 32px'
            }}
        >
            <Text
                size="h2"
                text="Delivered"
                textStyle={{ flex: '0 0 100%', marginBottom: 24 }}
            />
            <Statistic
                label="Notification Center"
                style={{ marginBottom: device === 'Mobile' ? 8 : 0 }}
                value={
                    notificationCenterDelivered
                        ? notificationCenterDelivered.toString()
                        : '--'
                }
            />
            <Statistic
                label="Push Notification"
                style={{ marginBottom: device === 'Mobile' ? 8 : 0 }}
                value={pushDelivered ? pushDelivered.toString() : '--'}
            />

            <NotificationStatisticsPopover
                campaignId={campaignId}
                device={device}
                label="Success Rate"
                status="good"
                value={`${getSuccessRate().toFixed(2)}%`}
            >
                <StatDetail
                    detail="Attempted description"
                    name="Attempted"
                    value={(
                        pushAttempted + notificationCenterAttempted
                    ).toString()}
                />
                <StatDetail
                    detail="Delivered description"
                    name="Delivered"
                    value={(
                        pushDelivered + notificationCenterDelivered
                    ).toString()}
                />
                <StatDetail
                    detail="Unreachable description"
                    name="Unreachable"
                    value={(
                        pushUnreachable + notificationCenterUnreachable
                    ).toString()}
                />
                <StatDetail
                    detail="Invalid description"
                    name="Invalid"
                    value={(pushInvalid + notificationCenterInvalid).toString()}
                />
            </NotificationStatisticsPopover>
            <Text
                size="h2"
                text="Opened"
                textStyle={{ flex: '0 0 100%', margin: '40px 0 24px 0' }}
            />
            <NotificationStatisticsPopover
                campaignId={campaignId}
                device={device}
                label="NotificationCenter"
                value={
                    notificationCenterTotal
                        ? notificationCenterTotal.toString()
                        : '--'
                }
            >
                <StatDetail
                    detail="Total Opens"
                    name="Total Opens"
                    value={
                        notificationCenterTotal
                            ? notificationCenterTotal.toString()
                            : '--'
                    }
                />
                <StatDetail
                    detail="Unique Opens"
                    name="Unique Opens"
                    value={
                        notificationCenterUnique
                            ? notificationCenterUnique.toString()
                            : '--'
                    }
                />
            </NotificationStatisticsPopover>

            <NotificationStatisticsPopover
                campaignId={campaignId}
                device={device}
                label="Push Notification"
                value={(pushDirectUnique + pushInfluencedUnique).toString()}
            >
                <StatDetail
                    detail="Direct Opens"
                    name="Direct Opens"
                    value={
                        pushDirectUnique ? pushDirectUnique.toString() : '--'
                    }
                />
                <StatDetail
                    detail="Influenced Opens"
                    name="Influenced Opens"
                    value={
                        pushInfluencedUnique
                            ? pushInfluencedUnique.toString()
                            : '--'
                    }
                />
            </NotificationStatisticsPopover>
            <NotificationStatisticsPopover
                campaignId={campaignId}
                device={device}
                label="Open Rate"
                status="good"
                value={`${((100 * total) / totalDelivered).toFixed(1)}%`}
            >
                <StatDetail
                    detail="Delivered"
                    name="Delivered"
                    value={totalDelivered ? totalDelivered.toString() : '--'}
                />
                <StatDetail
                    detail="Opened"
                    name="Opened"
                    value={total ? total.toString() : '--'}
                />
            </NotificationStatisticsPopover>
        </div>
    )
}

const mapStateToProps = (
    state: State,
    ownProps: NotificationStatisticsProps
): NotificationStatisticsStateProps => {
    const { campaignId } = ownProps
    const {
        notificationDeliveredReport,
        notificationOpenedReport
    } = getCampaign(state, campaignId) as
        | ScheduledCampaign
        | AutomatedNotificationCampaign
    return {
        notificationDeliveredReport,
        notificationOpenedReport
    }
}

export default connect(
    mapStateToProps,
    {}
)(NotificationStatistics)

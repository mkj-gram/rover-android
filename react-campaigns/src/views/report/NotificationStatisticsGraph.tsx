/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { fetchReportConnection } from '../../actions'
import {
    getFormattedReport,
    getReportHasNextPage,
    getReportHasPreviousPage,
    getReportEndCursor,
    getReportStartCursor
} from '../../reducers'

import {
    Bar,
    BarChart,
    CartesianAxis,
    CartesianGrid,
    Label,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    light,
    foam,
    Text,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

export interface NotificationStatisticsGraphProps {
    campaignId: string
    device: Media
}

export interface NotificationStatisticsGraphStateProps {
    formattedReport: Array<StringMap<string | number>>
    hasNextPage: boolean
    hasPreviousPage: boolean
    endCursor: string
    startCursor: string
}

export interface NotificationStatisticsGraphDispatchProps {
    fetchReportConnection: (
        campaignId: string,
        after: string,
        before: string,
        first: number,
        last: number
    ) => void
}

type payload = {
    payload: {
        value: string
    }
}

class NotificationStatisticsGraph extends React.PureComponent<
    NotificationStatisticsGraphProps &
        NotificationStatisticsGraphStateProps &
        NotificationStatisticsGraphDispatchProps,
    {}
> {
    constructor(
        props: NotificationStatisticsGraphProps &
            NotificationStatisticsGraphStateProps &
            NotificationStatisticsGraphDispatchProps
    ) {
        super(props)

        this.fetchNextPage = this.fetchNextPage.bind(this)
        this.fetchPreviousPage = this.fetchPreviousPage.bind(this)
    }
    componentDidMount() {
        const { campaignId, fetchReportConnection } = this.props
        fetchReportConnection(campaignId, null, '', null, 12)
    }
    fetchNextPage() {
        const {
            campaignId,
            fetchReportConnection,
            endCursor,
            hasNextPage
        } = this.props
        if (!hasNextPage) {
            return
        }
        fetchReportConnection(campaignId, endCursor, null, 12, null)
    }
    fetchPreviousPage() {
        const {
            campaignId,
            fetchReportConnection,
            hasPreviousPage,
            startCursor
        } = this.props
        if (!hasPreviousPage) {
            return
        }
        fetchReportConnection(campaignId, null, startCursor, null, 12)
    }
    render() {
        const { formattedReport, hasNextPage, hasPreviousPage } = this.props
        return (
            <div
                style={{
                    backgroundColor: turquoise,
                    height: 368,
                    width: '100%',
                    padding: '0px 32px 24px 0px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 16,
                        paddingLeft: 32
                    }}
                >
                    <Text
                        size="medium"
                        textStyle={{ ...light, color: 'white' }}
                        text="Notification Opened"
                    />
                    <div>
                        <ArrowLeftIcon
                            fill="white"
                            onClick={this.fetchPreviousPage}
                        />
                        <ArrowRightIcon
                            fill={
                                hasNextPage ? 'white' : 'rgba(255,255,255,0.5)'
                            }
                            onClick={this.fetchNextPage}
                            style={{
                                marginLeft: 8
                            }}
                        />
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="95%">
                    <BarChart
                        width={736}
                        height={312}
                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        data={formattedReport}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="1.43 2.87"
                            stroke="white"
                        />
                        <XAxis
                            axisLine={{ stroke: '#5bc3cf', strokeWidth: 1 }}
                            dataKey="name"
                            tick={{
                                stroke: 'none',
                                fill: 'white',
                                fontFamily:
                                    'SourceSansPro-Bold, Source Sans Pro',
                                fontSize: 13,
                                fontWeight: 'bold'
                            }}
                            interval={2}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={{ stroke: turquoise }}
                            tick={{
                                stroke: 'none',
                                fill: 'white',
                                fontFamily:
                                    'SourceSansPro-Bold, Source Sans Pro',
                                fontSize: 13,
                                fontWeight: 'bold'
                            }}
                            tickLine={false}
                        />
                        <Bar dataKey="value" fill={foam} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

const mapStateToProps = (
    state: State
): NotificationStatisticsGraphStateProps => ({
    formattedReport: getFormattedReport(state),
    hasNextPage: getReportHasNextPage(state),
    hasPreviousPage: getReportHasPreviousPage(state),
    endCursor: getReportEndCursor(state),
    startCursor: getReportStartCursor(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): NotificationStatisticsGraphDispatchProps => ({
    fetchReportConnection: (
        campaignId: string,
        after: string,
        before: string,
        first: number,
        last: number
    ) => dispatch(fetchReportConnection(campaignId, after, before, first, last))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationStatisticsGraph)

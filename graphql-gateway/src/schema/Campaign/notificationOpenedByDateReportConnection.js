import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql'
import NotificationOpenedByDateReportConnection from '../NotificationOpenedByDateReportConnection'

import RoverApis from '@rover/apis'

import { analyticsClient } from '../../grpcClients'

const notificationOpenedByDateReportConnection = {
    type: NotificationOpenedByDateReportConnection,
    args: {
        after: { type: GraphQLID },
        before: { type: GraphQLID },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    resolve: async (
        { campaignId },
        { after, before, first, last },
        { authContext }
    ) => {
        const request = new RoverApis.analytics.Models.GetNotificationOpenedByDateReportRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)
        const cursor = new RoverApis.analytics.Models.Cursor()
        after && cursor.setAfter(after)
        before && cursor.setBefore(before)
        first && cursor.setFirst(first)
        last && cursor.setLast(last)
        request.setCursor(cursor)

        try {
            const response = await analyticsClient.getNotificationOpenedByDateReport(
                request
            )
            const reports = response.getReportsList()

            const edges = reports.map(report => {
                return {
                    cursor: report.getCursor(),
                    node: {
                        id: report.getId(),
                        notificationCenter: report.getNotificationCenter(),
                        pushDirect: report.getPushDirect(),
                        pushInfluenced: report.getPushInfluence()
                    }
                }
            })
            const endCursor = edges.slice(-1)[0].cursor
            const startCursor = edges[0].cursor
            const pageInfo = response.getPageInfo()
            return {
                edges: edges,
                pageInfo: {
                    hasNextPage: pageInfo.getHasNextPage(),
                    hasPreviousPage: pageInfo.getHasPreviousPage(),
                    startCursor,
                    endCursor
                }
            }
        } catch (err) {
            if (err && err == 3) {
                throw err
            }
            return {
                edges: [],
                pageInfo: {
                    hasNextPage: true,
                    hasPreviousPage: true,
                    startCursor: '',
                    endCursor: ''
                }
            }
        }
    }
}

export default notificationOpenedByDateReportConnection

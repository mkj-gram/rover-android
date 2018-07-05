import NotificationOpenedReport from '../NotificationOpenedReport'

import RoverApis from '@rover/apis'

import { analyticsClient } from '../../grpcClients'

const notificationOpenedReport = {
    type: NotificationOpenedReport,
    resolve: async ({ campaignId }, _, { authContext }) => {
        const request = new RoverApis.analytics.Models.GetNotificationOpenedReportRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)

        try {
            const response = await analyticsClient.getNotificationOpenedReport(
                request
            )

            return {
                total: response.getTotal(),
                unique: response.getUnique(),
                notificationCenterTotal: response.getNotificationCenterTotal(),
                notificationCenterUnique: response.getNotificationCenterUnique(),
                pushDirectTotal: response.getPushDirectTotal(),
                pushDirectUnique: response.getPushDirectUnique(),
                pushInfluenced: response.getPushInfluencedTotal(),
                pushUnique: response.getPushInfluencedUnique()
            }
        } catch (err) {
            if (err.code === 5) {
                return {
                    total: null,
                    unique: null,
                    notificationCenterTotal: null,
                    notificationCenterUnique: null,
                    pushDirectTotal: null,
                    pushDirectUnique: null,
                    pushInfluencedTotal: null,
                    pushInfluencedUnique: null
                }
            }
            throw new Error(err)
        }
    }
}

export default notificationOpenedReport

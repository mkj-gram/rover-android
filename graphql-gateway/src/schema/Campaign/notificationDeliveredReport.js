import NotificationDeliveredReport from '../NotificationDeliveredReport'

import RoverApis from '@rover/apis'

import { analyticsClient } from '../../grpcClients'

const notificationDeliveredReport = {
    type: NotificationDeliveredReport,
    resolve: async ({ campaignId }, _, { authContext }) => {
        const request = new RoverApis.analytics.Models.GetNotificationSentReportRequest()
        request.setAuthContext(authContext)
        request.setCampaignId(campaignId)
        try {
            const response = await analyticsClient.getNotificationSentReport(
                request
            )
            return {
                totalDelivered: response.getTotalDelivered(),
                uniqueDelivered: response.getUniqueDelivered(),
                notificationCenterAttempted: response.getNotificationCenterAttempted(),
                notificationCenterDelivered: response.getNotificationCenterDelivered(),
                notificationCenterUnreachable: response.getNotificationCenterUnreachable(),
                notificationCenterInvalid: response.getNotificationCenterInvalid(),
                pushAttempted: response.getPushAttempted(),
                pushDelivered: response.getPushDelivered(),
                pushUnreachable: response.getPushUnreachable(),
                pushInvalid: response.getPushInvalid()
            }
        } catch (err) {
            if (err.code === 5) {
                return {
                    totalDelivered: null,
                    uniqueDelivered: null,
                    notificationCenterAttempted: null,
                    notificationCenterDelivered: null,
                    notificationCenterUnreachable: null,
                    notificationCenterInvalid: null,
                    pushAttempted: null,
                    pushDelivered: null,
                    pushUnreachable: null,
                    pushInvalid: null
                }
            }
            throw err
        }
    }
}

export default notificationDeliveredReport

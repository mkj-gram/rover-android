import { GraphQLList, GraphQLNonNull } from 'graphql'

import Notification from '../Notification'

import RoverApis from '@rover/apis'
import { getNotificationFromProto } from '../../grpc/notification'
import { notificationClient } from '../../grpcClients'

const notifications = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
    resolve: async(
        { identifier: deviceId },
        _,
        { authContext }
    ) => {

        const request = new RoverApis.notification.v1.Models.ListNotificationsRequest()

        request.setAuthContext(authContext)
        request.setDeviceId(deviceId)

        const accountName = authContext.getAccountName()

        const response = await notificationClient.listNotifications(request)

      return response.getNotificationsList().map(n => {
        if (n.getTapBehaviorType() == 0) {
          const url = `rv-${accountName}://presentExperience?campaignID=${n.getCampaignId()}`
          n.setTapBehaviorUrl(url)
        }
        return getNotificationFromProto( n )
      })
    }
}

export default notifications

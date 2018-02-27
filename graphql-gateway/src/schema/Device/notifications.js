import { GraphQLList, GraphQLNonNull } from 'graphql'

import Notification from '../Notification'

const notifications = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
    resolve: ({ deviceIdentifier }) => {
        // TODO: Fetch notifications (inbox), passing in deviceIdentifier
        return [
            {
                __className: "Notification",
                id: "1111",
                campaignId: "7889",
                title: "20180204 -- Kirsch App",
                body: "Follow Super Bowl LII live now!",
                action: {
                    __className: "OpenURLNotificationAction",
                    url: "twitter://status?id=12345"
                },
                deliveredAt: "2018-02-05T14:18:50-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                __className: "Notification",
                id: "1112",
                campaignId: "7870",
                title: null,
                body: "Watch a live edition of Patriots All Access direct from Minnesota on the Not Done Network!",
                action: {
                    __className: "PresentExperienceNotificationAction",
                    experienceId: "59023009312e7a001f0b963a"
                },
                deliveredAt: "2018-02-04T14:18:50-05:00",
                expiresAt: null,
                isRead: true,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                __className: "Notification",
                id: "1113",
                campaignId: "7843",
                title: "20180201 -- RKK Live",
                body: "Robert Kraft joins us now live now on the Not Done Network",
                action: {
                    __className: "PresentWebsiteNotificationAction",
                    url: "https://www.rover.io"
                },
                deliveredAt: "2018-02-03T14:18:50-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: false,
                isDeleted: false
            }
        ]
    }
}

export default notifications

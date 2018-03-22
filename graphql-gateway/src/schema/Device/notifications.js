import { GraphQLList, GraphQLNonNull } from 'graphql'

import Notification from '../Notification'

const notifications = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
    resolve: ({ deviceIdentifier }) => {
        // TODO: Fetch notifications (inbox), passing in deviceIdentifier
        return [
            {
                id: "1111",
                campaignId: "5555",
                title: "Test Notification 1111/5555",
                body: "Open Twitter deep link w/ image attachment",
                attachment: {
                    type: "image",
                    url: "https://dy5jipgyozh6.cloudfront.net/wp-content/uploads/2017/05/08214717/small-dog-breeds-dont-shed.jpg"
                },
                action: {
                    type: "openUrl",
                    url: "twitter://status?id=12345"
                },
                uri: "twitter://status?id=12345&utm_source=rover&utm_medium=notification&utm_campaign=5555",
                deliveredAt: "2018-02-01T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                id: "1112",
                campaignId: "5556",
                title: "Test Notification 1112/5556",
                body: "Present experience, isRead = true",
                action: {
                    type: "presentExperience",
                    experienceId: "59023009312e7a001f0b963a"
                },
                uri: "rv-inbox://experience?id=59023009312e7a001f0b963a&campaignID=5556",
                deliveredAt: "2018-02-02T14:00:00-05:00",
                expiresAt: null,
                isRead: true,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                id: "1113",
                campaignId: "5557",
                title: "Test Notification 1113/5557",
                body: "Present Rover website",
                action: {
                    type: "presentWebsite",
                    url: "https://www.rover.io"
                },
                uri: "rv-inbox://website?url=https%3A%2F%2Fwww.rover.io%3Futm_source%3Drover%26utm_medium%3Dnotification%26utm_campaign%3D5557",
                deliveredAt: "2018-02-03T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                id: "1114",
                campaignId: "5558",
                title: null,
                body: "No title, just open the app",
                action: {
                    type: "openApp"
                },
                uri: "rv-inbox://open",
                deliveredAt: "2018-02-04T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                id: "1115",
                campaignId: "5559",
                title: "Test Notification 1115/5559",
                body: "Open Google in browser",
                action: {
                    type: "openUrl",
                    url: "http://www.google.com/"
                },
                uri: "https://www.google.com?utm_source=rover&utm_medium=notification&utm_campaign=5559",
                deliveredAt: "2018-02-05T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            },
            {
                id: "1116",
                campaignId: "5560",
                title: "Test Notification 1116/5560",
                body: "Notification center disabled",
                action: {
                    type: "openApp"
                },
                uri: "rv-inbox://open",
                deliveredAt: "2018-02-06T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: false,
                isDeleted: false
            },
            {
                id: "1117",
                campaignId: "5561",
                title: "Test Notification 1117/5560",
                body: "Previously deleted",
                action: {
                    type: "openApp"
                },
                uri: "rv-inbox://open",
                deliveredAt: "2018-02-07T14:00:00-05:00",
                expiresAt: null,
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: true
            },
            {
                id: "1118",
                campaignId: "5562",
                title: "Test Notification 1118/5562",
                body: "Expired!",
                action: {
                    type: "openApp"
                },
                uri: "rv-inbox://open",
                deliveredAt: "2018-02-09T14:00:00-05:00",
                expiresAt: "2018-02-08T14:00:00-05:00",
                isRead: false,
                isNotificationCenterEnabled: true,
                isDeleted: false
            }
        ]
    }
}

export default notifications

import { GraphQLInt, GraphQLObjectType } from 'graphql'

const NotificationDeliveredReport = new GraphQLObjectType({
    name: 'NotificationDeliveredReport',
    description: '',
    fields: () => ({
        totalDelivered: {
            type: GraphQLInt
        },
        uniqueDelivered: {
            type: GraphQLInt
        },
        notificationCenterAttempted: {
            type: GraphQLInt
        },
        notificationCenterDelivered: {
            type: GraphQLInt
        },
        notificationCenterUnreachable: {
            type: GraphQLInt
        },
        notificationCenterInvalid: {
            type: GraphQLInt
        },
        pushAttempted: {
            type: GraphQLInt
        },
        pushDelivered: {
            type: GraphQLInt
        },
        pushUnreachable: {
            type: GraphQLInt
        },
        pushInvalid: {
            type: GraphQLInt
        }
    })
})

export default NotificationDeliveredReport

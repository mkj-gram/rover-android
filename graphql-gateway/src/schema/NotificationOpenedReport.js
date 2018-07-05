import { GraphQLInt, GraphQLObjectType } from 'graphql'

const NotificationOpenedReport = new GraphQLObjectType({
    name: 'NotificationOpenedReport',
    description: '',
    fields: () => ({
        total: {
            type: GraphQLInt
        },
        unique: {
            type: GraphQLInt
        },
        notificationCenterTotal: {
            type: GraphQLInt
        },
        notificationCenterUnique: {
            type: GraphQLInt
        },
        pushDirectTotal: {
            type: GraphQLInt
        },
        pushDirectUnique: {
            type: GraphQLInt
        },
        pushInfluencedTotal: {
            type: GraphQLInt
        },
        pushInfluencedUnique: {
            type: GraphQLInt
        }
    })
})

export default NotificationOpenedReport

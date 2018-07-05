import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'
import { Node, PageInfo } from './Connection'
import NotificationOpenedByDateReport from './NotificationOpenedByDateReport'

const NotificationOpenedByDateReportConnection = new GraphQLObjectType({
    name: 'NotificationOpenedByDateReportConnection',
    description:
        'Connection to return paginated list of NotificationOpenedByDateReport',
    fields: () => ({
        edges: {
            type: new GraphQLNonNull(
                new GraphQLList(
                    new GraphQLNonNull(NotificationOpenedByDateReportEdge)
                )
            )
        },
        pageInfo: {
            type: new GraphQLNonNull(PageInfo)
        }
    })
})

const NotificationOpenedByDateReportEdge = new GraphQLObjectType({
    name: 'NotificationOpenedByDateReportEdge',
    description: '',
    fields: () => ({
        cursor: {
            type: new GraphQLNonNull(GraphQLString)
        },
        node: {
            type: NotificationOpenedByDateReport
        }
    })
})

export default NotificationOpenedByDateReportConnection

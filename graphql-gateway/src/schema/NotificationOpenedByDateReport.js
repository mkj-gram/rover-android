import {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} from 'graphql'
import { Node } from './Connection'

const NotificationOpenedByDateReport = new GraphQLObjectType({
    name: 'NotificationOpenedByDateReport',
    interfaces: [Node],
    description: '',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        notificationCenter: {
            type: GraphQLInt
        },
        pushDirect: {
            type: GraphQLInt
        },
        pushInfluenced: {
            type: GraphQLInt
        }
    })
})

export default NotificationOpenedByDateReport

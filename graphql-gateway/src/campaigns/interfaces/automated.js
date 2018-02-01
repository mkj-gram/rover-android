import {
    GraphQLBoolean,
    GraphQLInterfaceType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'
import PredicateAggregate from '../../segments/PredicateAggregate'

const automated = new GraphQLInterfaceType({
    name: 'AutomatedNotificationDetails',
    description: 'Attributes associated with Automated Notifcation Campaigns',
    fields: () => ({
        automatedMonday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Mondays if true'
        },
        automatedTuesday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Tuesdays if true'
        },
        automatedWednesday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Wednesdays if true'
        },
        automatedThursday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Thursdays if true'
        },
        automatedFriday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Fridays if true'
        },
        automatedSaturday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Saturdays if true'
        },
        automatedSunday: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The Campaign is delivered on Sundays if true'
        },
        automatedStartDate: {
            type: GraphQLString,
            description: 'Start date of the Campaign'
        },

        automatedEndDate: {
            type: GraphQLString,
            description: 'End date of the Campaign'
        },
        automatedStartTime: {
            type: GraphQLInt,
            description: 'Time in minutes since midnight to start the Campaign'
        },
        automatedEndTime: {
            type: GraphQLInt,
            description: 'Time in minutes since midnight to end the Campaign'
        },
        automatedTimeZone: {
            type: GraphQLString,
            description: ''
        },
        automatedUseLocalDeviceTime: {
            type: GraphQLBoolean,
            description: 'Campaign automation rules apply to local device time'
        },
        automatedEventName: {
            type: GraphQLString,
            description: 'Name of Event that triggers Campaign'
        },
        automatedEventPredicates: {
            type: new GraphQLNonNull(new GraphQLList(PredicateAggregate)),
            description: 'Create an Audience query inside Campaigns App'
        }
    })
})

export default automated

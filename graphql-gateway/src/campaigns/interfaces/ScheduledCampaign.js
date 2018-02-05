import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLString
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'

import { scheduledDeliveryStatus, scheduledType } from '../types/definitions'

const ScheduledCampaign = new GraphQLInterfaceType({
    name: 'ScheduledCampaign',
    description: 'Attributes associated with Scheduled Notifcation Campaigns',
    fields: () => ({
        scheduledType: {
            type: scheduledType
        },
        scheduledTimestamp: {
            type: GraphQLDateTime,
            description: 'Timestamp to send scheduled message'
        },
        scheduledTimeZone: {
            type: GraphQLString,
            description: 'Timezone used to parse scheduledTimestamp'
        },
        scheduledUseLocalDeviceTime: {
            type: GraphQLBoolean,
            description: "Use this device's timezone"
        },
        scheduledDeliveryStatus: {
            type: scheduledDeliveryStatus
        }
    })
})

export default ScheduledCampaign

import { GraphQLObjectType } from 'graphql'

import regions from './regions'
import notifications from './notifications'

const Device = new GraphQLObjectType({
    name: 'Device',
    fields: {
        regions,
        notifications
    }
})

export default Device

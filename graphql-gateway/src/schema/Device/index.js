import { GraphQLObjectType } from 'graphql'

import profile from './profile'
import regions from './regions'
import notifications from './notifications'

const Device = new GraphQLObjectType({
    name: 'Device',
    fields: {
        profile,
        regions,
        notifications
    }
})

export default Device

import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} from 'graphql'

import Profile from './Profile'
import Region from './Region'
import Notification from './Notification'

import { marie } from '../fixtures/profiles'
import { geofenceRegions, beaconRegions } from '../fixtures/regions'
import notifications from '../fixtures/notifications'

const Device = new GraphQLObjectType({
    name: 'Device',
    fields: {
        profile: {
            type: Profile,
            resolve: ({ deviceIdentifier }) => {
                // TODO: Fetch profile, passing in deviceIdentifier
                return marie
            }
        },
        regions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Region))),
            resolve: ({ deviceIdentifier }) => {
                // TODO: Fetch regions, passing in deviceIdentifier
                let a = geofenceRegions.sort(() => .5 - Math.random()).slice(0, 15)
                let b = beaconRegions.sort(() => .5 - Math.random()).slice(0, 5)
                return a.concat(b)
            }
        },
        notifications: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Notification))),
            resolve: ({ deviceIdentifier }) => {
                // TODO: Fetch notifications (inbox), passing in deviceIdentifier
                return notifications
            }
        }
    }
})

export default Device

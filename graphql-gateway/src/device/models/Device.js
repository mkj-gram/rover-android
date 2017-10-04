import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} from 'graphql'

import Profile from './Profile'
import Region from './Region'

import { marie } from '../fixtures/profiles'
import { geofenceRegions, beaconRegions } from '../fixtures/regions'

const ApplicationState = new GraphQLObjectType({
    name: 'ApplicationState',
    fields: {
        profile: {
            type: Profile,
            resolve: () => marie
        },
        regions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Region))),
            resolve: () => {
                let a = geofenceRegions.sort(() => .5 - Math.random()).slice(0, 15)
                let b = beaconRegions.sort(() => .5 - Math.random()).slice(0, 5)
                return a.concat(b)
            }
        }
    }
})

export default ApplicationState

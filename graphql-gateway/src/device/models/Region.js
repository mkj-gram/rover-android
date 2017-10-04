import { GraphQLUnionType } from 'graphql'
import BeaconRegion from './BeaconRegion'
import GeofenceRegion from './GeofenceRegion'

const Region = new GraphQLUnionType({
    name: 'Region',
    types: () => [BeaconRegion, GeofenceRegion],
    resolveType: data => {
        if (data['latitude']) {
            return GeofenceRegion
        }

        return BeaconRegion
    }
})

export default Region

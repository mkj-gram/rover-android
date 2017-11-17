import { GraphQLNonNull } from 'graphql'
import DeviceState from '../models/DeviceState'
import { requireAuthentication } from '../../resolvers'

const DeviceStateQuery = {
    type: DeviceState,
    resolve: requireAuthentication(() => ({}))
}

export default DeviceStateQuery

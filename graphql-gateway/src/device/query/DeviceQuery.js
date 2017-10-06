import { GraphQLNonNull } from 'graphql'
import Device from '../models/Device'
import { requireAuthentication } from '../../resolvers'

const DeviceQuery = {
    type: new GraphQLNonNull(Device),
    resolve: requireAuthentication(() => ({}))
}

export default DeviceQuery

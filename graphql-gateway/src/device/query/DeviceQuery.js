import { GraphQLNonNull } from 'graphql'
import Device from '../models/Device'

const DeviceQuery = {
    type: new GraphQLNonNull(Device),
    resolve: () => ({})
}

export default DeviceQuery

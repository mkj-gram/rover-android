import { GraphQLString } from 'graphql'
import Device from '../models/Device'
import { requireAuthentication } from '../../resolvers'

const DeviceQuery = {
    type: Device,
    args: {
        identifier: {
            type: GraphQLString
        }
    },
    resolve: requireAuthentication((_, args, ast) => ({
        deviceIdentifier: args.identifier || ast.deviceIdentifier
    }))
}

export default DeviceQuery

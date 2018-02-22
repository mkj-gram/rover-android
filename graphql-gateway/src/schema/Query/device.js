import { GraphQLString } from 'graphql'
import Device from '../Device'

const device = {
    type: Device,
    args: {
        identifier: {
            type: GraphQLString
        }
    },
    resolve: (_, args, ast) => ({
        deviceIdentifier: args.identifier || ast.deviceIdentifier
    })
}

export default device

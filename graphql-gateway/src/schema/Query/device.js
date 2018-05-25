import { 
    GraphQLNonNull, 
    GraphQLString 
} from 'graphql'

import Device from '../Device'

const device = {
    type: Device,
    args: {
        identifier: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (_, { identifier }) => ({ identifier })
}

export default device

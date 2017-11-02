import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../grpcClients'
promisify(audienceClient)

import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'

const StringSuggestionQuery = {
    description: 'Returns suggestions list for StringPredicates',
    type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    args: {
        field: { type: new GraphQLNonNull(GraphQLString) },
        selector: { type: new GraphQLNonNull(GraphQLString) },
        size: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_, { field, selector, size }, { authContext }) => {

        const getSelectorEnum = selector => {
            switch (selector) {
                case 'ROVER_PROFILE':
                    return 0
                    break
                case 'CUSTOM_PROFILE':
                    return 1
                    break
                case 'DEVICE':
                default:
                    return 2
            }
        }

        const request = new RoverApis.audience.v1.Models.GetFieldSuggestionRequest()
        const newAuth = new RoverApis.auth.v1.Models.AuthContext()
        newAuth.setAccountId(148)
        request.setAuthContext(newAuth)
        request.setField(field)
        request.setSelector(getSelectorEnum(selector))
        request.setSize(size)

        const response = await audienceClient.getFieldSuggestion(request)
        return response.getSuggestionsList()
    }
}

export default StringSuggestionQuery

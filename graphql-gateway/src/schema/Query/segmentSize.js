import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

const segmentSize = {
    type: GraphQLInt,
    args: {
        segmentIds: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLID))
            )
        },
        condition: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async (_, { segmentIds, condition }, { authContext }) => {
        const { QueryRequest } = RoverApis.audience.v1.Models
        const request = new QueryRequest()
        const iterator = new QueryRequest.PageIterator()
        const querySegments = new QueryRequest.QuerySegments()

        iterator.setPage(0)
        iterator.setSize(0)

        querySegments.setIdsList(segmentIds)
        querySegments.setCondition(condition === 'ANY' ? 0 : 1)

        request.setAuthContext(authContext)
        request.setQuerySegments(querySegments)
        request.setPageIterator(iterator)

        const response = await audienceClient.query(request)
        return response.getTotalSize()
    }
}

export default segmentSize

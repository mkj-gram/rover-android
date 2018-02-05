import RoverApis from '@rover/apis'
import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import SegmentData from './SegmentData'
import { getSegmentPageByPredicates } from './SegmentRowsQuery'

import { audienceClient } from '../grpcClients'
import buildPredicateAggregate from '../grpc/audience/buildPredicateAggregate'
import getProfileFromProto, { getEmptyProfileValues } from '../grpc/audience/getProfileFromProto'
import getDeviceFromProto from '../grpc/audience/getDeviceFromProto'
import promisify from '@rover-common/grpc-promisify'


promisify(audienceClient)

const SegmentFromPredicatesQuery = {
    type: SegmentData,
    args: {
        predicates: {
            type: new GraphQLNonNull(GraphQLString)
        },
        pageNumber: {
            type: GraphQLInt
        },
        pageSize: {
            type: GraphQLInt
        },
        condition: {
            type: GraphQLString
        }
    },
    resolve: async(_, { predicates, pageNumber, pageSize, condition}, {authContext}) => {

        /*
            Use Query Api with an empty set of predicates to get the total number of devices
            This number will be accurate instead of using counter caches in the backend
         */
        const getTotalDevicesCount = async () => {
            const request = new RoverApis.audience.v1.Models.QueryRequest()
            request.setAuthContext(authContext)

            let predicateAggregate = new RoverApis.audience.v1.Models.PredicateAggregate()
            predicateAggregate.setPredicatesList([])
            request.setPredicateAggregate(predicateAggregate)

            const pageIterator = new RoverApis.audience.v1.Models.QueryRequest.PageIterator()
            pageIterator.setPage(0)
            pageIterator.setSize(0)

            request.setPageIterator(pageIterator)
            const response = await audienceClient.query(request)

            return response.getTotalSize()
        }


        let profiles = {}
        let dataGridRows = []

        const request = new RoverApis.audience.v1.Models.QueryRequest()
        const pageIterator = new RoverApis.audience.v1.Models.QueryRequest.PageIterator()

        pageIterator.setPage(pageNumber)
        pageIterator.setSize(pageSize)

        request.setAuthContext(authContext)
        request.setPageIterator(pageIterator)

        const predicateAggregate = buildPredicateAggregate(
            condition,
            predicates
        )

        request.setPredicateAggregate(predicateAggregate)

        const response = await audienceClient.query(request)
        const segmentSize = response.getTotalSize()

        response.getProfilesList().forEach(profile => {
            getProfileFromProto(profiles, profile)
        })

        dataGridRows = response.getDevicesList().map(device => {
          const deviceAttrs = getDeviceFromProto(device)
          const profileAttrs = profiles[device.getProfileIdentifier()] || []
          return deviceAttrs.concat(profileAttrs)
        })

        let totalSize = 0

        if (predicateAggregate.getPredicatesList().length === 0) {
            totalSize = segmentSize
        } else {
            totalSize = await getTotalDevicesCount()
        }

        return {
            dataGridRows,
            segmentSize,
            totalSize
        }
    }
}

export default SegmentFromPredicatesQuery

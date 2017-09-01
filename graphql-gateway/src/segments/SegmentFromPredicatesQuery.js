import RoverApis from '@rover/apis'
import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import SegmentData from './SegmentData'
import { getSegmentPageByPredicates } from './SegmentRowsQuery'

import { audienceClient } from '../grpcClients'
import { buildPredicateAggregate, profileFromProto, deviceFromProto } from '../grpc/grpc-helpers'
import promisify from '../../../node/grpc-promisify'


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
        let profiles = {}
        let devices = {}
        let dataGridRows = []

        const request = new RoverApis.audience.v1.Models.QueryRequest()
        const pageIterator = new RoverApis.audience.v1.Models.QueryRequest.PageIterator()
            
        pageIterator.setPage(pageNumber)
        pageIterator.setSize(pageSize)

        request.setAuthContext(authContext)
        request.setPageIterator(pageIterator)

        const predicateAggregate = buildPredicateAggregate(
            condition,
            predicates.replace(/'/g, `"`)
        )

        request.setPredicateAggregate(predicateAggregate)

        const response = await audienceClient.query(request)
        const segmentSize = response.getTotalSize()

        response.getProfilesList().forEach(profile => {
            profileFromProto(profiles, profile)
        })
        
        response.getDevicesList().forEach(device => {
            deviceFromProto(devices, device)
        })

        dataGridRows = Object.keys(devices).map(id => {
            return devices[id].concat(profiles[id])
        })

        const deviceRequest = new RoverApis.audience.v1.Models.GetDevicesTotalCountRequest()
        deviceRequest.setAuthContext(authContext)

        const deviceResponse = await audienceClient.getDevicesTotalCount(deviceRequest)
        const totalSize = deviceResponse.getTotal()

        return {
            dataGridRows,
            segmentSize,
            totalSize
        }
    }
}

export default SegmentFromPredicatesQuery

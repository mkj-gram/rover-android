import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../grpcClients'
import { buildPredicateAggregate, profileFromProto, deviceFromProto, buildQuery } from '../grpc/grpc-helpers'
promisify(audienceClient)

import { getSegmentPageById } from './SegmentRowsQuery'

import PredicateAggregate from './PredicateAggregate'
import SegmentData from './SegmentData'

const DynamicSegment = new GraphQLObjectType({
    name: 'DynamicSegment',
    description: 'Segment of total devices',
    fields: () => ({
        segmentId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({ segmentId }) => segmentId
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ name }) => name
        },
        data: {
            type: SegmentData,
            resolve: async({ predicateList, condition, pageNumber, pageSize}, _, {authContext}) => {
                const predicates = JSON.stringify(predicateList)
                let profiles = {}
                let devices = {}
                let dataGridRows = []

                const request = new RoverApis.audience.v1.Models.QueryRequest()
                const pageIterator = new RoverApis.audience.v1.Models.QueryRequest.PageIterator()
                    
                pageIterator.setPage(pageNumber)
                pageIterator.setSize(pageSize)

                request.setAuthContext(authContext)
                request.setPageIterator(pageIterator)

                // predicates should include field __typename, required by buildPredicateAggregate 
                // until DynamicSegments are no longer using Query API
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
        },
        predicates: {
            type: PredicateAggregate,
            resolve: ({ predicateList, condition }) => ({ predicateList, condition })
        },
    })
})



export default DynamicSegment

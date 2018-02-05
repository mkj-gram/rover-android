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
import buildPredicateAggregate from '../grpc/audience/buildPredicateAggregate'
import getProfileFromProto, { getEmptyProfileValues } from '../grpc/audience/getProfileFromProto'
import getDeviceFromProto from '../grpc/audience/getDeviceFromProto'
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

                const predicates = JSON.stringify(predicateList)
                let profiles = {}
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
                    getProfileFromProto(profiles, profile)
                })

                dataGridRows = response.getDevicesList().map(device => {
                  const deviceAttrs = getDeviceFromProto(device)
                  const profileAttrs = profiles[device.getProfileIdentifier()]

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
        },
        predicates: {
            type: PredicateAggregate,
            resolve: ({ predicateList, condition }) => ({ predicateList, condition })
        },
    })
})



export default DynamicSegment

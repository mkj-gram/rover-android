import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../grpcClients'
promisify(audienceClient)

import buildPredicateAggregate from '../grpc/audience/buildPredicateAggregate'
import { GraphQLString } from 'graphql'
import DynamicSegment from './DynamicSegment'
import SegmentInputType from './SegmentInputType'

const SegmentMutation = {
    createSegment: {
        type: DynamicSegment,
        description: 'Create a new segment',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: async (_, { segment }, { authContext }) => {
            const { name, predicates, queryCondition } = segment
            const request = new RoverApis.audience.v1.Models.CreateDynamicSegmentRequest()
            request.setAuthContext(authContext)
            request.setTitle(name)

            const predicateAggregate = buildPredicateAggregate(queryCondition, predicates)
            request.setPredicateAggregate(predicateAggregate)

            let response
            try {
                response = await audienceClient.createDynamicSegment(request)
            } catch (e) {
                throw new Error(e)
            }
            const seg = await response.getSegment()

            return { name: seg.getTitle(), segmentId: seg.getId() }
        }
    },
    updateSegmentName: {
        type: DynamicSegment,
        description: 'Update a segment name',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: async (_, { segment }, { authContext }) => {
            const { id, name } = segment
            
            const request = new RoverApis.audience.v1.Models.UpdateDynamicSegmentTitleRequest()
            request.setAuthContext(authContext)
            request.setSegmentId(id)
            request.setTitle(name)

            try {
                await audienceClient.updateDynamicSegmentTitle(request)
            } catch (e) {
                throw new Error(e)
            }
        }
    },
    updateDynamicSegmentPredicates: {
        type: DynamicSegment,
        description: 'Update segment predicates',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: async (_, { segment }, { authContext }) => {
            const { id, predicates, queryCondition } = segment
            const request = new RoverApis.audience.v1.Models.UpdateDynamicSegmentPredicatesRequest()
            request.setAuthContext(authContext)
            request.setSegmentId(id)
            const predicateAggregate = buildPredicateAggregate(queryCondition, predicates)
            request.setPredicateAggregate(predicateAggregate)

            try {
                await audienceClient.updateDynamicSegmentPredicates(request)
            } catch (e) {
                throw new Error(e)
            }
        }
    },
    archiveSegment: {
        type: GraphQLString,
        description: 'archive a segment',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: async (_, { segment }, { authContext }) => {
            const { id } = segment
            const request = new RoverApis.audience.v1.Models.UpdateDynamicSegmentArchiveStatusRequest()
            request.setAuthContext(authContext)
            request.setSegmentId(id)
            request.setArchived(true)

            try {
                await audienceClient.updateDynamicSegmentArchiveStatus(request)
            } catch (e) {
                throw new Error(e)
            }

            return 'archive success'
        }
    }
}

export default SegmentMutation

import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import buildPredicateAggregate from '../../grpc/audience/buildPredicateAggregate'

import DynamicSegment from '../DynamicSegment'
import { SegmentInputType } from '../Segment'

const updateDynamicSegmentPredicates = {
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
        const predicateAggregate = buildPredicateAggregate(
            queryCondition,
            predicates
        )
        request.setPredicateAggregate(predicateAggregate)

        try {
            await audienceClient.updateDynamicSegmentPredicates(request)
        } catch (e) {
            throw new Error(e)
        }
    }
}

export default updateDynamicSegmentPredicates

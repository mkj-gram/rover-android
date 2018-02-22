import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import buildPredicateAggregate from '../../grpc/audience/buildPredicateAggregate'

import DynamicSegment from '../DynamicSegment'
import { SegmentInputType } from '../Segment'

const createSegment = {
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

        const predicateAggregate = buildPredicateAggregate(
            queryCondition,
            predicates
        )
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
}

export default createSegment

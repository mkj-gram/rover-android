import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import DynamicSegment from '../DynamicSegment'
import { SegmentInputType } from '../Segment'

const updateSegmentName = {
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
}

export default updateSegmentName

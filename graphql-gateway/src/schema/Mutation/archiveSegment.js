import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import { GraphQLString } from 'graphql'

import { SegmentInputType } from '../Segment'

const archiveSegment = {
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

export default archiveSegment

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
            resolve: (_, { segment }) => {
                const { name } = segment
                return ({ name, id: 'qwerty' })
            }
        },
        updateSegment: {
            type: DynamicSegment,
            description: 'Update a segment',
            args: {
                segment: { type: SegmentInputType }
            },
            resolve: (_, { segment }) => {
                return ({ name: 'test', id: '12de34' })
            }
        },
        archiveSegment: {
            type: GraphQLString,
            description: 'archive a segment',
            args: {
                segment: { type: SegmentInputType }
            },
            resolve: (_, { segment }) => {
                return 'archive success'
            }
        }
    }

export default SegmentMutation

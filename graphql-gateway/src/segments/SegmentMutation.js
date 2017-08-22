import { GraphQLString } from 'graphql'
import DynamicSegment from './DynamicSegment'
import SegmentInputType from './SegmentInputType'
import { addSegment, updateSegment, archiveSegment } from './mockSegments'

var randomString = function(length) {
    var text = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

const SegmentMutation = {
    createSegment: {
        type: DynamicSegment,
        description: 'Create a new segment',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: (_, { segment }) => {
            const { name, predicates, queryCondition } = segment
            let rs = randomString(5)
            addSegment(name, rs, predicates, queryCondition)
            return { name, segmentId: rs }
        }
    },
    updateSegment: {
        type: DynamicSegment,
        description: 'Update a segment',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: (_, { segment }) => {
            let { id, name, predicates, queryCondition } = segment
            let seg = updateSegment(id, name, predicates, queryCondition)

            return { name: seg.name, segmentId: id }
        }
    },
    archiveSegment: {
        type: GraphQLString,
        description: 'archive a segment',
        args: {
            segment: { type: SegmentInputType }
        },
        resolve: (_, { segment }) => {
            archiveSegment(segment.id)
            return 'archive success'
        }
    }
}

export default SegmentMutation

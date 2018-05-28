import { GraphQLObjectType } from 'graphql'

import campaign from './campaign'
import campaigns from './campaigns'
import device from './device'
import dynamicSegment from './dynamicSegment'
import experience from './experience'
import segmentFromPredicates from './segmentFromPredicates'
import segmentSchema from './segmentSchema'
import segmentSize from './segmentSize'
import stringSuggestion from './stringSuggestion'

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        campaign,
        campaigns,
        device,
        dynamicSegment,
        experience,
        segmentFromPredicates,
        segmentSchema,
        segmentSize,
        stringSuggestion
    }
})

export default Query

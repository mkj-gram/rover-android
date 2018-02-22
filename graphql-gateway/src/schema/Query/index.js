import { GraphQLObjectType } from 'graphql'

import campaigns from './campaigns'
import device from './device'
import dynamicSegment from './dynamicSegment'
import experience from './experience'
import segmentFromPredicates from './segmentFromPredicates'
import segmentSchema from './segmentSchema'
import stringSuggestion from './stringSuggestion'

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        campaigns,
        device,
        dynamicSegment,
        experience,
        segmentFromPredicates,
        segmentSchema,
        stringSuggestion,
    }
})

export default Query

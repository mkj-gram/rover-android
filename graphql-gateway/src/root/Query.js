import { GraphQLObjectType } from 'graphql'
import CampaignsQuery from '../campaigns/CampaignsQuery'
import DeviceQuery from '../device/query/DeviceQuery'
import ExperienceQuery from '../experiences/query/ExperienceQuery'
import SegmentFromPredicatesQuery from '../segments/SegmentFromPredicatesQuery'
import DynamicSegmentQuery from '../segments/DynamicSegmentQuery'
import SegmentSchemaQuery from '../segments/SegmentSchemaQuery'
import StringSuggestionQuery from '../segments/StringSuggestionQuery'

class Query {}

Query.type = new GraphQLObjectType({
    name: 'Query',
    fields: {
        campaigns: CampaignsQuery,
        experience: ExperienceQuery,
        dynamicSegment: DynamicSegmentQuery,
        segmentFromPredicates: SegmentFromPredicatesQuery,
        segmentSchema: SegmentSchemaQuery,
        stringSuggestion: StringSuggestionQuery,
        device: DeviceQuery
    }
})

export default Query

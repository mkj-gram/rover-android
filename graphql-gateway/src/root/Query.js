import { GraphQLObjectType } from 'graphql'
import CampaignsQuery from '../campaigns/CampaignsQuery'
import DeviceStateQuery from '../device/query/DeviceStateQuery'
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
        deviceState: DeviceStateQuery
    }
})

export default Query

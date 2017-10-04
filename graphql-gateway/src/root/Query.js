import { GraphQLObjectType } from 'graphql'
import { CampaignRootType, nodeField } from '../campaigns/CampaignTypes'
import { getViewer } from '../database'
import DeviceQuery from '../device/query/DeviceQuery'
import ExperienceQuery from '../experiences/query/ExperienceQuery'
import SegmentFromPredicatesQuery from '../segments/SegmentFromPredicatesQuery'
import DynamicSegmentQuery from '../segments/DynamicSegmentQuery'
import SegmentSchemaQuery from '../segments/SegmentSchemaQuery'

class Query { }

Query.type = new GraphQLObjectType({
    name: 'Query',
    fields: {
        campaign: {
            type: CampaignRootType,
            resolve: () => getViewer()
        },
        node: nodeField,
        experience: ExperienceQuery,
        dynamicSegment: DynamicSegmentQuery,
        segmentFromPredicates: SegmentFromPredicatesQuery,
        segmentSchema: SegmentSchemaQuery,
        device: DeviceQuery
    }
})

export default Query

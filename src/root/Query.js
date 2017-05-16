import { GraphQLObjectType } from 'graphql'
import { CampaignRootType, nodeField } from '../campaigns/CampaignTypes'
import { getViewer } from '../database'
import ExperienceQuery from '../experiences/ExperienceQuery'
import EditableExperienceQuery from '../experiences/EditableExperienceQuery'
import SegmentFromPredicatesQuery from '../segments/SegmentFromPredicatesQuery'
import DynamicSegmentQuery from '../segments/DynamicSegmentQuery'
import SegmentSchemaQuery from '../segments/SegmentSchemaQuery'
import SyncQuery from '../sync/SyncQuery'

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
        editableExperience: EditableExperienceQuery,
        dynamicSegment: DynamicSegmentQuery,
        segmentFromPredicates: SegmentFromPredicatesQuery,
        segmentSchema: SegmentSchemaQuery,
        sync: SyncQuery
    }
})

export default Query

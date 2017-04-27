import { GraphQLObjectType } from 'graphql'
import { CampaignRootType, nodeField } from '../campaigns/CampaignTypes'
import { getViewer } from '../database'
import ExperienceQuery from '../experiences/ExperienceQuery'
import EditableExperienceQuery from '../experiences/EditableExperienceQuery'
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
        sync: SyncQuery
    }
})

export default Query

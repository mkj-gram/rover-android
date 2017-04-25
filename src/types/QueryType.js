import { GraphQLObjectType } from 'graphql'
import { CampaignRootType, nodeField } from './CampaignTypes'
import { getViewer } from '../database'
import ExperienceQuery from '../operations/ExperienceQuery'
import SyncQuery from '../operations/SyncQuery'

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        campaign: {
            type: CampaignRootType,
            resolve: () => getViewer()
        },
        node: nodeField,
        experience: ExperienceQuery,
        sync: SyncQuery
    }
})

export default QueryType

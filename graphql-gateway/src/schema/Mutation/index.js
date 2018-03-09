import { GraphQLObjectType } from 'graphql'

import archiveSegment from './archiveSegment'
import archiveCampaign from './archiveCampaign'
import createCampaign from './createCampaign'
import createSegment from './createSegment'
import duplicateCampaign from './duplicateCampaign'
import renameCampaign from './renameCampaign'
import trackEvents from './trackEvents'
import updateDeviceTestLabelProperty from './updateDeviceTestLabelProperty'
import updateDynamicSegmentPredicates from './updateDynamicSegmentPredicates'
import updateNotificationSettings from './updateNotificationSettings'
import updateSegmentName from './updateSegmentName'

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        archiveCampaign,
        archiveSegment,
        createCampaign,
        createSegment,
        duplicateCampaign,
        renameCampaign,
        trackEvents,
        updateDeviceTestLabelProperty,
        updateDynamicSegmentPredicates,
        updateNotificationSettings,
        updateSegmentName
    }
})

export default Mutation

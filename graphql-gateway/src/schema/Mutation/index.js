import { GraphQLObjectType } from 'graphql'

import archiveSegment from './archiveSegment'
import archiveCampaign from './archiveCampaign'
import createCampaign from './createCampaign'
import createSegment from './createSegment'
import duplicateCampaign from './duplicateCampaign'
import publishCampaign from './publishCampaign'
import renameCampaign from './renameCampaign'
import sendTestCampaign from './sendTestCampaign'
import trackEvents from './trackEvents'
import updateDeviceTestLabelProperty from './updateDeviceTestLabelProperty'
import updateDynamicSegmentPredicates from './updateDynamicSegmentPredicates'
import updateNotificationSettings from './updateNotificationSettings'
import updateScheduledDeliverySettings from './updateScheduledDeliverySettings'
import updateSegmentName from './updateSegmentName'

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        archiveCampaign,
        archiveSegment,
        createCampaign,
        createSegment,
        duplicateCampaign,
        publishCampaign,
        renameCampaign,
        sendTestCampaign,
        trackEvents,
        updateDeviceTestLabelProperty,
        updateDynamicSegmentPredicates,
        updateNotificationSettings,
        updateScheduledDeliverySettings,
        updateSegmentName
    }
})

export default Mutation

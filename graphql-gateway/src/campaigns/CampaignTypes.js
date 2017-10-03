import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    cursorForObjectInConnection,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
    toGlobalId
} from 'graphql-relay'

import {
    User,
    Campaign,
    addCampaign,
    updateCampaignData,
    getCampaign,
    getCampaigns,
    getUser,
    getViewer,
    removeCampaign
} from '../database'

import GraphQLJSON from 'graphql-type-json'
import GraphQLDate from 'graphql-date'
import uuid from 'node-uuid'

import Experience from '../experiences/models/Experience'

export const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
        const { type, id } = fromGlobalId(globalId)
        if (type === 'Campaign') return getCampaign(id)

        if (type === 'User') return getUser(id)

        return null
    },
    obj => {
        if (obj instanceof Campaign) return CampaignType
        if (obj instanceof User) return CampaignUserType
        return null
    }
)

const CampaignType = new GraphQLObjectType({
    name: 'Campaign',
    description: 'Rover Campaign',
    fields: () => ({
        id: globalIdField('Campaign'),
        name: {
            type: GraphQLString,
            resolve: obj => obj.name
        },
        roverId: {
            type: GraphQLString,
            resolve: obj => obj.id
        },
        state: {
            type: GraphQLString,
            resolve: obj => obj.state
        },
        campaignClass: {
            type: new GraphQLEnumType({
                name: 'CampaignClassEnumType',
                values: {
                    location: { value: 'location' },
                    scheduled: { value: 'scheduled' },
                    automatic: { value: 'automatic' },
                    url: { value: 'url' }
                }
            })
        },
        delivery: {
            type: new GraphQLList(new GraphQLEnumType({
                name: 'DeliveryEnumType',
                values: {
                    Push: { value: 'Push Notification' },
                    InApp: { value: 'In-App' },
                    Inbox: { value: 'Inbox' }
                }
            }))
        },
        geofenceData: {
            type: GeofenceType,
            resolve: obj => obj.geofenceData
        },
        beaconData: {
            type: BeaconType,
            resolve: obj => obj.beaconData
        },
        scheduleData: {
            type: ScheduleType,
            resolve: obj => obj.scheduleData
        },
        audienceData: {
            type: GraphQLString,
            resolve: obj => obj.audienceData
        },
        frequencyLimit: {
            type: new GraphQLList(FrequencyLimitType),
            resolve: obj =>  obj.frequencyLimit
        },
        recipients: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: obj => obj.recipients
        },
        campaignOpens: {
            type: new GraphQLNonNull(CampaignOpensType),
            resolve: obj => obj.campaignOpens
        },
        experience: {
            type: Experience,
            resolve: obj => obj.experience
        }
    }),
    interfaces: [nodeInterface]
})

const GeofenceInputType = new GraphQLInputObjectType({
    name: 'GeofenceInput',
    description: 'Geofence location information',
    fields: () => ({
        triggerEnter: { type: GraphQLBoolean },
        anyPlace: { type: GraphQLBoolean },
        placeTags: { type: new GraphQLList(GraphQLString) },
        placeNames: { type: new GraphQLList(GraphQLString) }
    })
})

const GeofenceType = new GraphQLObjectType({
    name: 'Geofence',
    description: 'Geofence location information',
    fields: () => ({
        triggerEnter: { type: GraphQLBoolean },
        anyPlace: { type: GraphQLBoolean },
        placeTags: { type: new GraphQLList(GraphQLString) },
        placeNames: { type: new GraphQLList(GraphQLString) }
    })
})

const BeaconInputType = new GraphQLInputObjectType({
    name: 'BeaconInput',
    description: 'Beacon information',
    fields: () => ({
        triggerEnter: { type: GraphQLBoolean },
        anyBeacon: { type: GraphQLBoolean },
        beaconTags: { type: new GraphQLList(GraphQLString) },
        beaconNames: { type: new GraphQLList(GraphQLString) },
        anyPlace: { type: GraphQLBoolean },
        placeTags: { type: new GraphQLList(GraphQLString) },
        placeNames: { type: new GraphQLList(GraphQLString) }
    })
})

const BeaconType = new GraphQLObjectType({
    name: 'Beacon',
    description: 'Beacon information',
    fields: () => ({
        triggerEnter: { type: GraphQLBoolean },
        anyBeacon: { type: GraphQLBoolean },
        beaconTags: { type: new GraphQLList(GraphQLString) },
        beaconNames: { type: new GraphQLList(GraphQLString) },
        anyPlace: { type: GraphQLBoolean },
        placeTags: { type: new GraphQLList(GraphQLString) },
        placeNames: { type: new GraphQLList(GraphQLString) }
    })
})

const ScheduleInputType = new GraphQLInputObjectType({
    name: 'ScheduleInput',
    description: 'Schedule of campaign',
    fields: () => ({
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
        days: { type: new GraphQLList(GraphQLString) },
        startDate: { type: GraphQLDate },
        endDate: { type: GraphQLDate }
    })
})

const ScheduleType = new GraphQLObjectType({
    name: 'Schedule',
    description: 'Schedule of campaign',
    fields: () => ({
        startTime: { type: GraphQLString },
        endTime: { type: GraphQLString },
        days: { type: new GraphQLList(GraphQLString) },
        startDate: { type: GraphQLDate },
        endDate: { type: GraphQLDate }
    })
})

const FrequencyLimitInputType = new GraphQLInputObjectType({
    name: 'FrequencyLimitInput',
    description: 'Frequency Limits of Campaign',
    fields: () => ({
        limitCount: { type: new GraphQLNonNull(GraphQLInt) },
        periodCount: { type: new GraphQLNonNull(GraphQLInt) },
        periodType: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const FrequencyLimitType = new GraphQLObjectType({
    name: 'FrequencyLimit',
    description: 'Frequency Limits of Campaign',
    fields: () => ({
        limitCount: { type: new GraphQLNonNull(GraphQLInt) },
        periodCount: { type: new GraphQLNonNull(GraphQLInt) },
        periodType: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const CampaignOpensType = new GraphQLObjectType({
    name: 'CampaignOpens',
    description: 'Number of times a campaign was opened by delivery method',
    fields: () => ({
        inbox: { type: new GraphQLNonNull(GraphQLInt) },
        inapp: { type: new GraphQLNonNull(GraphQLInt) },
        push: { type: new GraphQLNonNull(GraphQLInt) },
        uniqueOpens: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const {
    connectionType: CampaignConnection,
    edgeType: CampaignTypeEdge
} = connectionDefinitions({
    name: 'Campaign',
    nodeType: CampaignType
})

export const CampaignUserType = new GraphQLObjectType({
    name: 'CampaignUser',
    fields: {
        id: globalIdField('CampaignUser'),
        name: {
            type: GraphQLString,
            resolve: obj => obj.name
        },
        email: {
            type: GraphQLString,
            resolve: obj => obj.email
        },
        campaigns: {
            type: CampaignConnection,
            args: {
              state: {
                type: GraphQLString,
                defaultValue: null,
              },
              roverId: {
                  type: GraphQLString,
                  defaultValue: null
              },
              campaignClass: {
                  type: GraphQLString,
                  defaultValue: null
              },
              ...connectionArgs
            },
            resolve: (obj, { state, roverId, campaignClass, ...args}) => connectionFromArray(getCampaigns(state, roverId, campaignClass), args)
        }
    },
    interfaces: [nodeInterface]
})

export const CampaignRootType = new GraphQLObjectType({
    name: 'CampaignRoot',
    fields: {
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        },
        node: nodeField
    }
})

export const AddCampaignMutation = mutationWithClientMutationId({
    name: 'AddCampaign',
    inputFields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        campaignClass: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        campaignEdge: {
            type: CampaignTypeEdge,
            resolve: ({ newCampaignId }) => {
                const campaign = getCampaign(id)
                return {
                    cursor: cursorForObjectInConnection(getCampaigns(), campaign),
                    node: campaign,
                }
            }
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        },
        roverId: {
            type: GraphQLString,
            resolve: ({ newCampaignId }) => {
              const campaign = getCampaign(newCampaignId)
              return campaign.roverId
            }
        }
    },
    mutateAndGetPayload: ({ name, campaignClass }) => {
        const newCampaignId = addCampaign(name, campaignClass)
        return { newCampaignId }
    }
})

const ChangeCampaignNameMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignName',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ name, id }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'name', name)
        return { localCampaignId }
    }
})

const ChangeCampaignClassMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignClass',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        campaignClass: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ name }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'campaignClass', campaignClass)
        return { localCampaignId }
    }
})

const ChangeCampaignStateMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignState',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        state: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, state }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'state', state)
        return { localCampaignId }
    }
})

const ChangeCampaignGeofenceDataMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignGeofenceData',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        geofenceData: { type: new GraphQLNonNull(GeofenceInputType) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, geofenceData }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'geofenceData', geofenceData)
        return { localCampaignId }
    }
})

const ChangeCampaignBeaconDataMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignBeaconData',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        beaconData: { type: new GraphQLNonNull(BeaconInputType) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, beaconData }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'beaconData', beaconData)
        return { localCampaignId }
    }
})

const ChangeCampaignScheduleDataMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignScheduleData',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        scheduleData: { type: new GraphQLNonNull(ScheduleInputType) }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, scheduleData }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'scheduleData', scheduleData)
        return { localCampaignId }
    }
})

const ChangeCampaignAudienceDataMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignAudienceData',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        audienceData: { type: GraphQLString }
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, audienceData }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'audienceData', audienceData)
        return { localCampaignId }
    }
})

const ChangeCampaignFrequencyLimitMutation = mutationWithClientMutationId({
    name: 'ChangeCampaignFrequencyLimit',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        frequencyLimit: { type: new GraphQLNonNull(FrequencyLimitInputType)}
    },
    outputFields: {
        campaign: {
            type: CampaignType,
            resolve: ({ localCampaignId }) => getCampaign(localCampaignId)
        },
        viewer: {
            type: CampaignUserType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({ id, frequencyLimit }) => {
        const localCampaignId = fromGlobalId(id).id
        updateCampaignData(id, 'frequencyLimit', FrequencyLimit)
        return { localCampaignId }
    }
})

export const CampaignMutation = new GraphQLObjectType({
    name: 'CampaignMutation',
    fields: {
        addCampaign: AddCampaignMutation,
        changeCampaignName: ChangeCampaignNameMutation,
        changeCampaignState: ChangeCampaignStateMutation,
        changeGeofenceData: ChangeCampaignGeofenceDataMutation,
        changeBeaconData: ChangeCampaignBeaconDataMutation,
        changeCampaignScheduleData: ChangeCampaignScheduleDataMutation,
        changeCampaignAudienceData: ChangeCampaignAudienceDataMutation,
        changeCampaignFrequencyLimit: ChangeCampaignFrequencyLimitMutation,
    }
})

export const campaignMutations = {
    addCampaign: AddCampaignMutation,
    changeCampaignName: ChangeCampaignNameMutation,
    changeCampaignState: ChangeCampaignStateMutation,
    changeGeofenceData: ChangeCampaignGeofenceDataMutation,
    changeBeaconData: ChangeCampaignBeaconDataMutation,
    changeCampaignScheduleData: ChangeCampaignScheduleDataMutation,
    changeCampaignAudienceData: ChangeCampaignAudienceDataMutation,
    changeCampaignFrequencyLimit: ChangeCampaignFrequencyLimitMutation,
}

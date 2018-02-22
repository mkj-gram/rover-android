import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../../grpcClients'
promisify(audienceClient)

import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql'

const updateDeviceTestLabelProperty = {
    type: GraphQLBoolean,
    description: 'Update is_device_test or label property',
    args: {
        deviceId: {
            type:  new GraphQLNonNull(GraphQLString)
        },
        isTestDevice: {
            type:  new GraphQLNonNull(GraphQLBoolean)
        },
        label: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async(_, {deviceId, isTestDevice, label}, {authContext}) => {
        const testDeviceRequest = new RoverApis.audience.v1.Models.UpdateDeviceTestPropertyRequest()
        testDeviceRequest.setAuthContext(authContext)
        testDeviceRequest.setDeviceId(deviceId)
        testDeviceRequest.setIsTestDevice(isTestDevice)

        const labelDeviceRequest = new RoverApis.audience.v1.Models.UpdateDeviceLabelPropertyRequest()
        labelDeviceRequest.setAuthContext(authContext)
        labelDeviceRequest.setDeviceId(deviceId)
        labelDeviceRequest.setLabel(label)
        await audienceClient.updateDeviceTestProperty(testDeviceRequest)
        await audienceClient.updateDeviceLabelProperty(labelDeviceRequest)

        return true
    }
}

export default updateDeviceTestLabelProperty

import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation UpdateDeviceTestLabelPropertyMutation($deviceId: String!, $isTestDevice: Boolean!, $label: String!) {
        updateDeviceTestLabelProperty(deviceId: $deviceId, isTestDevice: $isTestDevice, label: $label) 
    }
`

export default (deviceId, isTestDevice, label, handleUpdatingState) => {
    const variables = {
        deviceId,
        isTestDevice,
        label
    }

    commitMutation(
        environment,
        {
            mutation,
            variables,
            updater: (proxyStore) => {
                // ToDo: Update store once Relay allows for non-scalar array type values to be used with `setValue`
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    handleUpdatingState()
                } else {
                    throw new Error(response)
                }
            },
            onError: err => console.log(err)
        }
    )
}

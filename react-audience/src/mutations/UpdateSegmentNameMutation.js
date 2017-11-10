import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation UpdateSegmentNameMutation($segment: SegmentInput) {
        updateSegmentName(segment: $segment) {
            segmentId
            name
        }
    }
`

export default (id, name = null, setSegment = null) => {
    const variables = {
        segment: {
            id,
            name
        }
    }

    commitMutation(
        environment,
        {
            mutation,
            variables,
            updater: (proxyStore) => {
                const records = proxyStore.getRoot().getLinkedRecords('dynamicSegment')
                let rec
                records.forEach((record) => {
                    if (record.getValue('segmentId') && record.getValue('segmentId') === id) {
                        rec = record
                    }
                })
                rec.setValue(name, 'name')
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    if (setSegment !== null) {
                        setSegment({ id })
                    }
                } else {
                    throw new Error(response)
                }
            },
            onError: (err) => { throw new Error(err) }
        }
    )
}

import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation ArchiveSegmentMutation($segment: SegmentInput) {
        archiveSegment(segment: $segment)
    }
`

export default (id, archiveSegment) => {
    const variables = {
        segment: {
            id
        }
    }

    commitMutation(
        environment,
        {
            mutation,
            variables,
            updater: (proxyStore) => {
                const records = proxyStore.getRoot().getLinkedRecords('dynamicSegment')

                const remainingRecords = records.filter(record => record.getValue('segmentId') !== id)
                proxyStore.getRoot().setLinkedRecords(remainingRecords, 'dynamicSegment')
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    archiveSegment(id)
                } else {
                    throw new Error(response)
                }
            },
            onError: err => console.log(err)
        }
    )
}

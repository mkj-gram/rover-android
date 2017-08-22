import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation UpdateSegmentMutation($segment: SegmentInput) {
        updateSegment(segment: $segment) {
            segmentId
            name
        }
    }
`

export default (id, name = null, predicates = null, setSegment=null, queryCondition = null) => {
    const variables = {
        segment: {
            id,
            name,
            predicates,
            queryCondition
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
                    if (record.getValue('segmentId') !== undefined && record.getValue('segmentId') === id) {
                        rec = record
                    }
                })
                if (name !== null) {
                    rec.setValue(name, 'name')
                } else if (predicates !== null || queryCondition !== null) {
                    rec.setValue(predicates, 'predicates')
                    rec.setValue(queryCondition, 'queryCondition')
                }
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    if (setSegment !== null) {
                        setSegment(response.updateSegment)
                    }
                } else {
                    throw new Error(response)
                }
            },
            onError: err => console.log(err)
        }
    )
}

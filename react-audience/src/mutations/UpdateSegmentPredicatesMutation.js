import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation UpdateSegmentPredicatesMutation($segment: SegmentInput) {
        updateDynamicSegmentPredicates(segment: $segment) {
            segmentId
            name
        }
    }
`

export default (id, predicates = null, setSegment = null, queryCondition = null) => {
    const variables = {
        segment: {
            id,
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
                rec.setValue(predicates, 'predicates')
                rec.setValue(queryCondition, 'queryCondition')
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    if (setSegment !== null) {
                        setSegment({ segmentId: id })
                    }
                } else {
                    throw new Error(response)
                }
            },
            onError: (err) => { throw new Error(err) }
        }
    )
}

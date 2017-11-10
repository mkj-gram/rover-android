import {
    commitMutation,
    graphql
} from 'react-relay'

import environment from '../relay/Environment'

const mutation = graphql`
    mutation CreateSegmentMutation($segment: SegmentInput) {
        createSegment(segment: $segment) {
            segmentId
            name
        }
    }
`

export default (name, predicates, setSegment, queryCondition) => {
    const variables = {
        segment: {
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
                const newEdgeNode = proxyStore.getRootField('createSegment')
                const prevPosts = proxyStore.getRoot().getLinkedRecords('dynamicSegment')

                proxyStore.getRoot().setLinkedRecords(prevPosts.concat(newEdgeNode), 'dynamicSegment')
            },
            onCompleted: (response) => {
                if (response !== 'error') {
                    setSegment(response.createSegment)
                } else {
                    throw new Error(response)
                }
            },
            onError: err => console.log(err)
        }
    )
}

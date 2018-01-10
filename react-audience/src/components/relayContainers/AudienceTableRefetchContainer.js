import { graphql, createRefetchContainer } from 'react-relay'
import AudienceTable from '../table/AudienceTable'

export default createRefetchContainer(
    AudienceTable,
    graphql`
        fragment AudienceTableRefetchContainer on Query
            @argumentDefinitions(
                segmentId: { type: "ID", defaultValue: "" }
                includeSegmentsFromPredicates: {
                    type: "Boolean!"
                    defaultValue: true
                }
                predicates: { type: "String!", defaultValue: "[]" }
                includeDynamicSegment: { type: "Boolean!", defaultValue: false }
                pageNumber: { type: "Int", defaultValue: 0 }
                condition: { type: "String", defaultValue: "ANY" }
            ) {
            adgDynamicSegment: dynamicSegment(
                segmentId: $segmentId
                pageNumber: $pageNumber
                pageSize: 150
            ) @include(if: $includeDynamicSegment) {
                ... on DynamicSegment {
                    name
                    segmentId
                    data {
                        segmentSize
                        totalSize
                        dataGridRows
                    }
                }
            }
            adgSegmentSchema: segmentSchema {
                deviceSchema {
                    ... on SchemaAttribute {
                        attribute
                        __typename: type
                        label,
                        selector
                    }
                }
                profileSchema {
                    ... on SchemaAttribute {
                        attribute
                        __typename: type
                        label
                    }
                }
            }
            adgSegmentsFromPredicates: segmentFromPredicates(
                predicates: $predicates
                pageNumber: $pageNumber
                pageSize: 150
                condition: $condition
            ) @include(if: $includeSegmentsFromPredicates) {
                ... on SegmentData {
                    segmentSize
                    totalSize
                    dataGridRows
                }
            }
        }
    `,
    graphql`
        query AudienceTableRefetchContainerQuery(
            $segmentId: ID
            $includeSegmentsFromPredicates: Boolean!
            $predicates: String!
            $includeDynamicSegment: Boolean!
            $pageNumber: Int
            $condition: String
        ) {
            ...AudienceTableRefetchContainer
                @arguments(
                    segmentId: $segmentId
                    includeSegmentsFromPredicates: $includeSegmentsFromPredicates
                    predicates: $predicates
                    includeDynamicSegment: $includeDynamicSegment
                    pageNumber: $pageNumber
                    condition: $condition
                )
        }
    `
)

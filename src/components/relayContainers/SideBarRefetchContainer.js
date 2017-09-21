import { graphql, createRefetchContainer } from 'react-relay'
import SideBar from '../sidebar/SideBar'

export default createRefetchContainer(
    SideBar,
    graphql.experimental`
        fragment SideBarRefetchContainer on Query
            @argumentDefinitions(segmentId: { type: "ID", defaultValue: "" }) {
            sbDynamicSegment: dynamicSegment(segmentId: $segmentId) {
                segmentId
                name
                predicates {
                    condition
                    predicateList {
                        ... on Predicate {
                            __typename
                            attribute
                            selector
                            ... on StringPredicate {
                                stringValue
                                stringComparison
                            }
                            ... on VersionPredicate {
                                versionValue
                                versionComparison
                            }
                            ... on DatePredicate {
                                dateValue {
                                    start
                                    end
                                }
                                dateComparison
                            }
                            ... on BooleanPredicate {
                                booleanValue
                                booleanComparison
                            }
                            ... on NumberPredicate {
                                numberValue
                                numberComparison
                            }
                            ... on GeofencePredicate {
                                geofenceValue {
                                    latitude
                                    longitude
                                    radius
                                    name
                                }
                                geofenceComparison
                            }
                        }
                    }
                }
            }
            segmentSchema {
                deviceSchema {
                    attribute
                    __typename: type
                    label
                }
                profileSchema {
                    attribute
                    __typename: type
                    label
                }
            }
            segmentsContainer: dynamicSegment {
                ...SegmentsContainer_segments
            }
        }
    `,
    graphql.experimental`
        query SideBarRefetchContainerQuery($segmentId: ID) {
            ...SideBarRefetchContainer @arguments(segmentId: $segmentId)
        }
    `
)

import { graphql, createRefetchContainer } from 'react-relay'
import SideBar from '../sidebar/SideBar'

export default createRefetchContainer(
    SideBar,
    graphql`
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
                                    ... on DatePredicateValue {
                                        start {
                                            year
                                            month
                                            day
                                        }
                                    }
                                    ... on DurationPredicateValue {
                                        duration 

                                    }
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
                            ... on FloatPredicate {
                                floatValue
                                floatComparison
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
                            ... on StringArrayPredicate {
                                stringArrayValue
                                stringArrayComparison
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
                    selector
                }
                profileSchema {
                    attribute
                    __typename: type
                    label
                }
            }
            segmentsContainer: dynamicSegment {
                ...SegmentsContainer_segments
            },
            device_manufacturer_suggestions: stringSuggestion(
                field: "device_manufacturer"
                selector: "DEVICE"
                size: 100
            ),
            device_model_suggestions: stringSuggestion(
                field: "device_model"
                selector: "DEVICE"
                size: 100
            ),
            os_name_suggestions: stringSuggestion(
                field: "os_name"
                selector: "DEVICE"
                size: 100
            ),
            locale_language_suggestions: stringSuggestion(
                field: "locale_language"
                selector: "DEVICE"
                size: 100
            ),
            locale_region_suggestions: stringSuggestion(
                field: "locale_region"
                selector: "DEVICE"
                size: 100
            ),
            location_country_suggestions: stringSuggestion(
                field: "location_country"
                selector: "DEVICE"
                size: 100
            ),
            location_state_suggestions: stringSuggestion(
                field: "location_state"
                selector: "DEVICE"
                size: 100
            ),
            location_city_suggestions: stringSuggestion(
                field: "location_city"
                selector: "DEVICE"
                size: 100
            ),
            carrier_name_suggestions: stringSuggestion(
                field: "carrier_name"
                selector: "DEVICE"
                size: 100
            ),
            time_zone_suggestions: stringSuggestion(
                field: "time_zone"
                selector: "DEVICE"
                size: 100
            )
        }
    `,
    graphql`
        query SideBarRefetchContainerQuery($segmentId: ID) {
            ...SideBarRefetchContainer @arguments(segmentId: $segmentId)
        }
    `
)

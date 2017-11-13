package elastic

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/predicates"
	"github.com/roverplatform/rover/go/zoneinfo"
	"time"
)

type M = map[string]interface{}

var (
	TimeNow = time.Now

	// Use Toronto timezone as default zone where date/duration data should be compared with
	Zone = "America/Toronto"
)

func DeviceAndProfilePredicateAggregateToQuery(aggregate *audience.PredicateAggregate, offset *audience.QueryRequest_TimeZoneOffset) (M, error) {

	/*
		I want all the filters for profiles and all the filters for devices then construct a query
	*/

	var (
		should  = []M{}
		must    = []M{}
		mustNot = []M{}

		profilePredicates = getProfilePredicates(aggregate.GetPredicates())
		devicePredicates  = getDevicePredicates(aggregate.GetPredicates())
	)

	if offset != nil {
		zonesFilter := TimeZoneOffsetToFilter(offset.GetSeconds())
		must = append(must, zonesFilter)
	}

	deviceFilter, err := PredicatesToFilter(aggregate.GetCondition(), devicePredicates)
	if err != nil {
		return nil, err
	}

	dshould, ok := deviceFilter["filter"].(M)["bool"].(M)["should"].([]M)
	if ok {
		should = append(should, dshould...)
	}

	dmust, ok := deviceFilter["filter"].(M)["bool"].(M)["must"].([]M)
	if ok {
		must = append(must, dmust...)
	}

	dmustNot, ok := deviceFilter["filter"].(M)["bool"].(M)["must_not"].([]M)
	if ok {
		mustNot = append(mustNot, dmustNot...)
	}

	var wrapProfileFilter = func(filter M) M {
		return M{
			"has_parent": M{
				"parent_type": "profile",
				"query": M{
					"bool": M{
						"filter": filter,
					},
				},
			},
		}
	}

	profileFilter, err := PredicatesToFilter(aggregate.GetCondition(), profilePredicates)

	// TODO dry up
	pshould, ok := profileFilter["filter"].(M)["bool"].(M)["should"].([]M)
	if ok {
		for _, i := range pshould {
			pfilter := wrapProfileFilter(i)
			should = append(should, pfilter)
		}
	}

	pmust, ok := profileFilter["filter"].(M)["bool"].(M)["must"].([]M)
	if ok {
		for _, i := range pmust {
			pfilter := wrapProfileFilter(i)
			must = append(must, pfilter)
		}
	}

	pmustNot, ok := profileFilter["filter"].(M)["bool"].(M)["must_not"].([]M)
	if ok {
		for _, i := range pmustNot {
			pfilter := wrapProfileFilter(i)
			mustNot = append(mustNot, pfilter)
		}
	}

	var rootBoolFilter = M{}

	if len(must) > 0 {
		rootBoolFilter["must"] = must
	}

	if len(mustNot) > 0 {
		rootBoolFilter["must_not"] = mustNot
	}

	if len(should) > 0 {
		rootBoolFilter["should"] = should
	}

	// The query should return all devices that also have a valid profile

	mustFilter, ok := rootBoolFilter["must"].([]M)
	// Make sure its initialized
	if !ok {
		mustFilter = []M{}
		rootBoolFilter["must"] = mustFilter
	}

	// Match all using the filter context
	hasProfileFilter := M{
		"has_parent": M{
			"inner_hits":  M{},
			"parent_type": "profile",
			"query": M{
				"bool": M{
					"filter": M{
						"bool": M{},
					},
				},
			},
		},
	}

	mustFilter = append(mustFilter, hasProfileFilter)

	rootBoolFilter["must"] = mustFilter

	query := M{
		"query": M{
			"bool": M{
				"filter": M{
					"bool": rootBoolFilter,
				},
			},
		},
	}

	return query, nil
}

// TODO dry up ProfilePredicateAggregateToQuery and DevicePredicateAggregateToQuery
func ProfilePredicateAggregateToQuery(aggregate *audience.PredicateAggregate) (M, error) {

	var (
		profilePredicates = getProfilePredicates(aggregate.GetPredicates())
	)

	profileFilter, err := PredicatesToFilter(aggregate.GetCondition(), profilePredicates)

	if err != nil {
		return nil, err
	}

	query := M{
		"query": M{
			"bool": profileFilter,
		},
	}
	return query, nil
}

func DevicePredicateAggregateToQuery(aggregate *audience.PredicateAggregate) (M, error) {
	var (
		devicePredicates = getDevicePredicates(aggregate.GetPredicates())
	)

	deviceFilter, err := PredicatesToFilter(aggregate.GetCondition(), devicePredicates)

	if err != nil {
		return nil, err
	}

	query := M{
		"query": M{
			"bool": deviceFilter,
		},
	}
	return query, nil
}

func TimeZoneOffsetToFilter(offset int32) M {
	timezones := zoneinfo.GetZones(int(offset))

	return M{
		"terms": M{
			"time_zone": timezones,
		},
	}
}

// Takes a list of predicates and converts them to elastic filters disregarding the predicate selector
func PredicatesToFilter(condition audience.PredicateAggregate_Condition, predicates []*audience.Predicate) (M, error) {
	var (
		must    = make([]M, 0, len(predicates))
		mustNot = make([]M, 0, len(predicates))
	)
	for _, predicate := range predicates {

		var (
			filter M

			isMustFilter = false
			err          error
		)

		switch predicate.GetValue().(type) {
		case *audience.Predicate_StringPredicate:
			filter, isMustFilter, err = stringPredicateToQuery(predicate)
		case *audience.Predicate_BoolPredicate:
			filter, isMustFilter, err = boolPredicateToQuery(predicate)
		case *audience.Predicate_NumberPredicate:
			filter, isMustFilter, err = numberPredicateToQuery(predicate)
		case *audience.Predicate_VersionPredicate:
			filter, isMustFilter, err = versionPredicateToQuery(predicate)
		case *audience.Predicate_GeofencePredicate:
			filter, isMustFilter, err = geofencePredicateToQuery(predicate)
		case *audience.Predicate_DoublePredicate:
			filter, isMustFilter, err = doublePredicateToQuery(predicate)
		case *audience.Predicate_StringArrayPredicate:
			filter, isMustFilter, err = stringArrayPredicateToQuery(predicate)
		case *audience.Predicate_DatePredicate:
			filter, isMustFilter, err = datePredicateToQuery(predicate)
		case *audience.Predicate_DurationPredicate:
			filter, isMustFilter, err = durationPredicateToQuery(predicate)
		default:
			return nil, errors.Errorf("Unknown predicate type %T", predicate)
		}

		if err != nil {
			return nil, err
		}

		if isMustFilter {
			must = append(must, filter)
		} else {
			mustNot = append(mustNot, filter)
		}
	}

	var rootBoolFilter M
	var boolFilter = M{}

	if len(must) > 0 {
		boolFilter["must"] = must
	}

	if len(mustNot) > 0 {
		boolFilter["must_not"] = mustNot
	}

	if condition == audience.PredicateAggregate_ANY {
		should := []M{}

		for _, m := range must {
			should = append(should, m)
		}

		for _, mn := range mustNot {
			shouldMustNot := M{
				"bool": M{
					"must_not": []M{
						mn,
					},
				},
			}

			should = append(should, shouldMustNot)
		}

		rootBoolFilter = M{
			"should": should,
		}

	} else {
		rootBoolFilter = boolFilter
	}

	filter := M{
		"filter": M{
			"bool": rootBoolFilter,
		},
	}

	return filter, nil
}

func getProfilePredicates(predicates []*audience.Predicate) []*audience.Predicate {
	var (
		profilePredicates []*audience.Predicate
	)

	for _, p := range predicates {
		if p.GetSelector() == audience.Predicate_ROVER_PROFILE || p.GetSelector() == audience.Predicate_CUSTOM_PROFILE {
			profilePredicates = append(profilePredicates, p)
		}
	}

	return profilePredicates
}

func getDevicePredicates(predicates []*audience.Predicate) []*audience.Predicate {
	var (
		devicePredicates []*audience.Predicate
	)

	for _, p := range predicates {
		if p.GetSelector() == audience.Predicate_DEVICE {
			devicePredicates = append(devicePredicates, p)
		}
	}

	return devicePredicates
}

// TODO: a similar function was implemented in https://github.com/RoverPlatform/rover/blob/70d39e3547aadec9529456330a74a5469f3769d6/audience/service/predicates/tester.go#L83-L105
// this should be extracted out into the apis folders maybe
func getAttributeNameFromPredicate(predicate *audience.Predicate) string {
	switch p := predicate.GetValue().(type) {
	case *audience.Predicate_StringPredicate:
		return p.StringPredicate.AttributeName
	case *audience.Predicate_BoolPredicate:
		return p.BoolPredicate.AttributeName
	case *audience.Predicate_NumberPredicate:
		return p.NumberPredicate.AttributeName
	case *audience.Predicate_DatePredicate:
		return p.DatePredicate.AttributeName
	case *audience.Predicate_VersionPredicate:
		return p.VersionPredicate.AttributeName
	case *audience.Predicate_GeofencePredicate:
		return p.GeofencePredicate.AttributeName
	case *audience.Predicate_DoublePredicate:
		return p.DoublePredicate.AttributeName
	case *audience.Predicate_StringArrayPredicate:
		return p.StringArrayPredicate.AttributeName
	case *audience.Predicate_DurationPredicate:
		return p.DurationPredicate.AttributeName
	default:
		// TODO log or throw error here???
		return ""

	}
}

func getElasticsearchAttributeName(predicate *audience.Predicate) string {
	var (
		selector               = predicate.GetSelector()
		predicateAttributeName = getAttributeNameFromPredicate(predicate)
	)

	switch selector {
	case audience.Predicate_CUSTOM_PROFILE:
		return fmt.Sprintf("attributes.%s", predicateAttributeName)
	case audience.Predicate_ROVER_PROFILE:
		return predicateAttributeName
	case audience.Predicate_DEVICE:
		return predicateAttributeName
	default:
		return ""
	}
}

func getElasticsearchMissingValue(name string, selector audience.Predicate_Selector) interface{} {
	switch selector {
	case audience.Predicate_CUSTOM_PROFILE:
		return nil
	case audience.Predicate_ROVER_PROFILE:
		schema, ok := predicates.ProfileSchema[name]
		if !ok {
			// TODO
		}

		return schema.MissingValue
	case audience.Predicate_DEVICE:
		schema, ok := predicates.DeviceSchema[name]
		if !ok {
			// TODO
		}

		return schema.MissingValue
	default:
		return nil
	}
}

// bool indicates if this is a must or must_not query
func stringPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName   = getElasticsearchAttributeName(predicate)
		missingValue    = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		stringPredicate = predicate.GetStringPredicate()
		value           = predicate.GetStringPredicate().GetValue()
		op              = stringPredicate.GetOp()
	)

	switch op {
	case audience.StringPredicate_IS_SET, audience.StringPredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.StringPredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.StringPredicate_IS_UNSET, nil
		}
	case audience.StringPredicate_IS_EQUAL, audience.StringPredicate_IS_NOT_EQUAL:
		return M{
			"term": M{
				attributeName: value,
			},
		}, op == audience.StringPredicate_IS_EQUAL, nil
	case audience.StringPredicate_STARTS_WITH:
		return M{
			"prefix": M{
				attributeName: value,
			},
		}, true, nil
	case audience.StringPredicate_ENDS_WITH:
		return M{
			"wildcard": M{
				attributeName: fmt.Sprintf("*%s", value),
			},
		}, true, nil
	case audience.StringPredicate_CONTAINS, audience.StringPredicate_DOES_NOT_CONTAIN:
		return M{
			"wildcard": M{
				attributeName: fmt.Sprintf("*%s*", value),
			},
		}, op == audience.StringPredicate_CONTAINS, nil

	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func boolPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName = getElasticsearchAttributeName(predicate)
		missingValue  = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		boolPredicate = predicate.GetBoolPredicate()
		value         = predicate.GetBoolPredicate().GetValue()
		op            = boolPredicate.GetOp()
	)

	switch op {
	case audience.BoolPredicate_IS_SET, audience.BoolPredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.BoolPredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.BoolPredicate_IS_UNSET, nil
		}
	case audience.BoolPredicate_IS_EQUAL:
		return M{
			"term": M{
				attributeName: value,
			},
		}, true, nil
	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func numberPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName   = getElasticsearchAttributeName(predicate)
		missingValue    = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		numberPredicate = predicate.GetNumberPredicate()
		value           = predicate.GetNumberPredicate().GetValue()
		value2          = predicate.GetNumberPredicate().GetValue2()
		op              = numberPredicate.GetOp()
	)

	switch op {
	case audience.NumberPredicate_IS_SET, audience.NumberPredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.NumberPredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.NumberPredicate_IS_UNSET, nil
		}
	case audience.NumberPredicate_IS_EQUAL, audience.NumberPredicate_IS_NOT_EQUAL:
		return M{
			"term": M{
				attributeName: value,
			},
		}, op == audience.NumberPredicate_IS_EQUAL, nil
	case audience.NumberPredicate_IS_GREATER_THAN:
		return M{
			"range": M{
				attributeName: M{
					"gt": value,
				},
			},
		}, true, nil
	case audience.NumberPredicate_IS_LESS_THAN:
		return M{
			"range": M{
				attributeName: M{
					"lt": value,
				},
			},
		}, true, nil
	case audience.NumberPredicate_IS_BETWEEN:
		return M{
			"range": M{
				attributeName: M{
					"gte": value,
					"lte": value2,
				},
			},
		}, true, nil

	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func versionPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName    = getElasticsearchAttributeName(predicate)
		missingValue     = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		versionPredicate = predicate.GetVersionPredicate()
		value            = predicate.GetVersionPredicate().GetValue()
		value2           = predicate.GetVersionPredicate().GetValue2()
		op               = versionPredicate.GetOp()

		majorAttribute    = fmt.Sprintf("%s.major", attributeName)
		minorAttribute    = fmt.Sprintf("%s.minor", attributeName)
		revisionAttribute = fmt.Sprintf("%s.revision", attributeName)
	)

	switch op {
	case audience.VersionPredicate_IS_SET, audience.VersionPredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.VersionPredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.VersionPredicate_IS_UNSET, nil
		}
	case audience.VersionPredicate_IS_EQUAL, audience.VersionPredicate_IS_NOT_EQUAL:
		return M{
			"bool": M{
				"must": []M{
					{
						"term": M{
							majorAttribute: value.GetMajor(),
						},
					},
					{
						"term": M{
							minorAttribute: value.GetMinor(),
						},
					},
					{
						"term": M{
							revisionAttribute: value.GetRevision(),
						},
					},
				},
			},
		}, op == audience.VersionPredicate_IS_EQUAL, nil

	case audience.VersionPredicate_IS_GREATER_THAN:
		return M{
			"bool": M{
				"should": []M{
					{
						"range": M{
							majorAttribute: M{
								"gt": value.GetMajor(),
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"gt": value.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"gt": value.GetRevision(),
										},
									},
								},
							},
						},
					},
				},
			},
		}, true, nil
	case audience.VersionPredicate_IS_LESS_THAN:
		return M{
			"bool": M{
				"should": []M{
					{
						"range": M{
							majorAttribute: M{
								"lt": value.GetMajor(),
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"lt": value.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"lt": value.GetRevision(),
										},
									},
								},
							},
						},
					},
				},
			},
		}, true, nil
	case audience.VersionPredicate_IS_BETWEEN:
		return M{
			"bool": M{
				"should": []M{
					{
						"range": M{
							majorAttribute: M{
								"gt": value.GetMajor(),
								"lt": value2.GetMajor(),
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"gt": value.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"gte": value.GetRevision(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value2.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"lt": value2.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value2.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value2.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"lte": value2.GetRevision(),
										},
									},
								},
							},
						},
					},
				},
			},
		}, true, nil
	case audience.VersionPredicate_IS_GREATER_THAN_OR_EQUAL:
		return M{
			"bool": M{
				"should": []M{
					{
						"range": M{
							majorAttribute: M{
								"gt": value.GetMajor(),
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"gt": value.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"gte": value.GetRevision(),
										},
									},
								},
							},
						},
					},
				},
			},
		}, true, nil
	case audience.VersionPredicate_IS_LESS_THAN_OR_EQUAL:
		return M{
			"bool": M{
				"should": []M{
					{
						"range": M{
							majorAttribute: M{
								"gt": value.GetMajor(),
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"range": M{
										minorAttribute: M{
											"gt": value.GetMinor(),
										},
									},
								},
							},
						},
					},
					{
						"bool": M{
							"must": []M{
								{
									"term": M{
										majorAttribute: value.GetMajor(),
									},
								},
								{
									"term": M{
										minorAttribute: value.GetMinor(),
									},
								},
								{
									"range": M{
										revisionAttribute: M{
											"lte": value.GetRevision(),
										},
									},
								},
							},
						},
					},
				},
			},
		}, true, nil
	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func geofencePredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName     = getElasticsearchAttributeName(predicate)
		missingValue      = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		geofencePredicate = predicate.GetGeofencePredicate()
		value             = predicate.GetGeofencePredicate().GetValue()

		op = geofencePredicate.GetOp()
	)

	switch op {
	case audience.GeofencePredicate_IS_SET, audience.GeofencePredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.GeofencePredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.GeofencePredicate_IS_UNSET, nil
		}
	case audience.GeofencePredicate_IS_WITHIN, audience.GeofencePredicate_IS_OUTSIDE:
		return M{
			"geo_distance": M{
				"distance": fmt.Sprintf("%dm", value.GetRadius()),
				attributeName: M{
					"lat": value.GetLatitude(),
					"lon": value.GetLongitude(),
				},
			},
		}, op == audience.GeofencePredicate_IS_WITHIN, nil
	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func doublePredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName   = getElasticsearchAttributeName(predicate)
		missingValue    = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		doublePredicate = predicate.GetDoublePredicate()
		value           = predicate.GetDoublePredicate().GetValue()
		value2          = predicate.GetDoublePredicate().GetValue2()
		op              = doublePredicate.GetOp()
	)

	switch op {
	case audience.DoublePredicate_IS_SET, audience.DoublePredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.DoublePredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.DoublePredicate_IS_UNSET, nil
		}
	case audience.DoublePredicate_IS_EQUAL, audience.DoublePredicate_IS_NOT_EQUAL:
		return M{
			"term": M{
				attributeName: value,
			},
		}, op == audience.DoublePredicate_IS_EQUAL, nil
	case audience.DoublePredicate_IS_GREATER_THAN:
		return M{
			"range": M{
				attributeName: M{
					"gt": value,
				},
			},
		}, true, nil
	case audience.DoublePredicate_IS_LESS_THAN:
		return M{
			"range": M{
				attributeName: M{
					"lt": value,
				},
			},
		}, true, nil
	case audience.DoublePredicate_IS_BETWEEN:
		return M{
			"range": M{
				attributeName: M{
					"gte": value,
					"lte": value2,
				},
			},
		}, true, nil

	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func stringArrayPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName  = getElasticsearchAttributeName(predicate)
		missingValue   = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
		arrayPredicate = predicate.GetStringArrayPredicate()
		value          = predicate.GetStringArrayPredicate().GetValue()

		op = arrayPredicate.GetOp()
	)

	switch op {
	case audience.StringArrayPredicate_IS_SET, audience.StringArrayPredicate_IS_UNSET:
		if missingValue == nil {
			// We cannot query null values instead use the "exists" api
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.StringArrayPredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.StringArrayPredicate_IS_UNSET, nil
		}
	case audience.StringArrayPredicate_CONTAINS_ALL, audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL:
		var (
			must = make([]M, 0, len(value))
		)

		for _, v := range value {
			stringValFilter := M{
				"term": M{
					attributeName: v,
				},
			}

			must = append(must, stringValFilter)
		}

		var esCondition = "must"

		// Since we are nesting the bool condition we need to apply De Morgan's law
		// !(a && b) == (!a or !b)
		if op == audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL {
			esCondition = "should"
		}

		return M{
			"bool": M{
				esCondition: must,
			},
		}, op == audience.StringArrayPredicate_CONTAINS_ALL, nil
	case audience.StringArrayPredicate_CONTAINS_ANY, audience.StringArrayPredicate_DOES_NOT_CONTAIN_ANY:
		return M{
			"terms": M{
				attributeName: value,
			},
		}, op == audience.StringArrayPredicate_CONTAINS_ANY, nil

	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func durationPredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName     = getElasticsearchAttributeName(predicate)
		durationPredicate = predicate.GetDurationPredicate()
		op                = durationPredicate.GetOp()
		dur               = durationPredicate.GetValue().Duration
		formatDuration    uint32
	)

	if durationPredicate.GetValue().Type == audience.DurationPredicate_Duration_DAYS {
		formatDuration = dur * 24 * 60 * 60
	} else {
		// ToDo: Implement other time unit types (hour, minute, second)
	}

	toDateString := func(day uint32, month uint32, year uint32) string {
		return fmt.Sprintf("%04d-%02d-%02d||/d", year, month, day)
	}

	loc, err := time.LoadLocation(Zone)
	if err != nil {
		return nil, false, err
	}

	timezoneTime := TimeNow().In(loc)

	tYear, tMonth, tDay := timezoneTime.Add(-time.Duration(formatDuration) * time.Second).Date()
	tYear1, tMonth1, tDay1 := timezoneTime.AddDate(0, 0, 1).Add(-time.Duration(formatDuration) * time.Second).Date()

	switch op {
	case audience.DurationPredicate_IS_LESS_THAN:
		return M{
			"range": M{
				attributeName: M{
					"lt":        toDateString(uint32(tDay), uint32(tMonth), uint32(tYear)),
					"time_zone": Zone,
				},
			},
		}, true, nil
	case audience.DurationPredicate_IS_GREATER_THAN:
		return M{
			"range": M{
				attributeName: M{
					"gt":        toDateString(uint32(tDay), uint32(tMonth), uint32(tYear)),
					"time_zone": Zone,
				},
			},
		}, true, nil
	case audience.DurationPredicate_IS_EQUAL:
		return M{
			"range": M{
				attributeName: M{
					"lt":        toDateString(uint32(tDay1), uint32(tMonth1), uint32(tYear1)),
					"gte":       toDateString(uint32(tDay), uint32(tMonth), uint32(tYear)),
					"time_zone": Zone,
				},
			},
		}, true, nil
	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

func datePredicateToQuery(predicate *audience.Predicate) (M, bool, error) {
	var (
		attributeName = getElasticsearchAttributeName(predicate)
		datePredicate = predicate.GetDatePredicate()
		op            = datePredicate.GetOp()
		val           = predicate.GetDatePredicate().GetValue()
		missingValue  = getElasticsearchMissingValue(attributeName, predicate.GetSelector())
	)

	toDateString := func(day uint32, month uint32, year uint32) string {
		return fmt.Sprintf("%04d-%02d-%02d||/d", year, month, day)
	}

	switch op {
	case audience.DatePredicate_IS_SET, audience.DatePredicate_IS_UNSET:
		if missingValue == nil {
			return M{
				"exists": M{
					"field": attributeName,
				},
			}, op == audience.DatePredicate_IS_SET, nil
		} else {
			return M{
				"term": M{
					attributeName: missingValue,
				},
			}, op == audience.DatePredicate_IS_UNSET, nil
		}
	case audience.DatePredicate_IS_AFTER:
		return M{
			"range": M{
				attributeName: M{
					"gt":        toDateString(val.Day, val.Month, val.Year),
					"time_zone": Zone,
				},
			},
		}, true, nil
	case audience.DatePredicate_IS_BEFORE:
		return M{
			"range": M{
				attributeName: M{
					"lt":        toDateString(val.Day, val.Month, val.Year),
					"time_zone": Zone,
				},
			},
		}, true, nil
	case audience.DatePredicate_IS_ON:
		// Add 1 day to the predicate value
		y, m, d := time.Date(int(val.Year), time.Month(val.Month), int(val.Day), 0, 0, 0, 0, time.UTC).AddDate(0, 0, 1).Date()
		onVal := toDateString(uint32(d), uint32(m), uint32(y))
		return M{
			"range": M{
				attributeName: M{
					"gte":       toDateString(val.Day, val.Month, val.Year),
					"lt":        onVal,
					"time_zone": Zone,
				},
			},
		}, true, nil

	default:
		return nil, false, errors.Errorf("Unknown operation %d", op)
	}
}

package predicates_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/go-test/deep"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/predicates"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	"io/ioutil"
	"os"
	"os/exec"
	"reflect"
	"strings"
	"testing"
	"time"
)

func TestPredicates(t *testing.T) {
	t.Run("StringPredicates", testPredicates_StringPredicates)
	t.Run("BoolPredicates", testPredicates_BoolPredicates)
	t.Run("NumberPredicates", testPredicates_NumberPredicates)
	t.Run("DoublePredicates", testPredicates_DoublePredicates)
	t.Run("DatePredicates", testPredicates_DatePredicates)
	t.Run("VersionPredicates", testPredicates_VersionPredicates)
	t.Run("GeofencePredicates", testPredicates_GeofencePredicates)
	t.Run("StringArrayPredicates", testPredicates_StringArrayPredicates)
	t.Run("DurationPredicates", testPredicates_DurationPredicates)
	t.Run("ComplexPredicates", testPredicates_ComplexPredicates)
}

func parseTime(t *testing.T, str string) time.Time {
	ts, err := time.Parse(time.RFC3339Nano, str)
	if err != nil {
		t.Fatal("parseTime:", err)
	}

	return ts
}

func protoTs(t *testing.T, ti time.Time) *timestamp.Timestamp {
	ts, err := timestamp.TimestampProto(ti)
	if err != nil {
		t.Fatal("protoTs:", err)
	}
	return ts
}

func identifiedProfile(t *testing.T) *audience.Profile {
	return &audience.Profile{
		Id:         "d0000000000000000000000d",
		AccountId:  1,
		Identifier: "bob",
		Attributes: map[string]*audience.Value{
			"first-name": audience.StringVal("billy bee"),
			"age":        audience.IntegerVal(36),
			"viscosity":  audience.DoubleVal(100000.00),
			"is-ready":   audience.BoolVal(true),
			"ready-at":   audience.TimestampVal(*protoTs(t, parseTime(t, "2013-06-05T14:10:43.678Z"))),
			"tags":       audience.StringArrayVal("a", "b", "c"),
		},
	}
}

func device(t *testing.T, profileId string) *audience.Device {
	return &audience.Device{
		Id:        "d00000000000000000000000",
		DeviceId:  "abc",
		AccountId: 1,
		ProfileId: profileId,
		Frameworks: map[string]*audience.Version{
			"io.rover.Rover": {
				Major:    1,
				Minor:    1,
				Revision: 2,
			},
		},
		LocationLatitude:  43.650737,
		LocationLongitude: -79.375877,
		LocationAccuracy:  5,
		CreatedAt:         protoTs(t, parseTime(t, "2013-06-05T14:10:43.678Z")),
		UpdatedAt:         protoTs(t, parseTime(t, "2013-06-05T14:10:43.678Z")),
		IsTestDevice:      true,
		Label:             "my little label",
	}

}

func device2(t *testing.T, profileId string) *audience.Device {
	return &audience.Device{
		Id:        "d00000000000000000000000",
		DeviceId:  "abc",
		AccountId: 1,
		ProfileId: profileId,
		Frameworks: map[string]*audience.Version{
			"io.rover.Rover": {
				Major:    1,
				Minor:    1,
				Revision: 2,
			},
		},
		LocationLatitude:  43.650737,
		LocationLongitude: -79.375877,
		LocationAccuracy:  5,
		CreatedAt:         protoTs(t, parseTime(t, "1999-10-20T14:10:43.678Z")),
		UpdatedAt:         protoTs(t, parseTime(t, "2013-06-05T14:10:43.678Z")),
		IsTestDevice:      true,
		Label:             "my little label",
	}

}

func testPredicates_StringPredicates(t *testing.T) {
	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_IS_EQUAL,
									AttributeName: "first-name",
									Value:         "billy bee",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is not equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_IS_NOT_EQUAL,
									AttributeName: "first-name",
									Value:         "BZZZZ",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "starts with",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_STARTS_WITH,
									AttributeName: "first-name",
									Value:         "bill",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "ends with",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_ENDS_WITH,
									AttributeName: "first-name",
									Value:         "ee",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "contains",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_CONTAINS,
									AttributeName: "first-name",
									Value:         "lly",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "does not contains",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_DOES_NOT_CONTAIN,
									AttributeName: "first-name",
									Value:         "NOPEX@",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is not set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_IS_UNSET,
									AttributeName: "DOESNOTEXIST@",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_IS_SET,
									AttributeName: "first-name",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_BoolPredicates(t *testing.T) {
	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_BoolPredicate{
								BoolPredicate: &audience.BoolPredicate{
									Op:            audience.BoolPredicate_IS_EQUAL,
									AttributeName: "is-ready",
									Value:         true,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_BoolPredicate{
								BoolPredicate: &audience.BoolPredicate{
									Op:            audience.BoolPredicate_IS_SET,
									AttributeName: "is-ready",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is unset",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_BoolPredicate{
								BoolPredicate: &audience.BoolPredicate{
									Op:            audience.BoolPredicate_IS_UNSET,
									AttributeName: "is-ready",
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    false,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_NumberPredicates(t *testing.T) {
	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									Op:            audience.NumberPredicate_IS_EQUAL,
									AttributeName: "age",
									Value:         36,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is not equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									Op:            audience.NumberPredicate_IS_NOT_EQUAL,
									AttributeName: "age",
									Value:         22,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is greater than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									Op:            audience.NumberPredicate_IS_GREATER_THAN,
									AttributeName: "age",
									Value:         22,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    false,
			expErr: nil,
		},
		{
			name: "is less than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									Op:            audience.NumberPredicate_IS_LESS_THAN,
									AttributeName: "age",
									Value:         22,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is between",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									Op:            audience.NumberPredicate_IS_BETWEEN,
									AttributeName: "age",
									Value:         22,
									Value2:        55,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_DoublePredicates(t *testing.T) {
	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_DoublePredicate{
								DoublePredicate: &audience.DoublePredicate{
									Op:            audience.DoublePredicate_IS_EQUAL,
									AttributeName: "viscosity",
									Value:         100000.00,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is not equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_DoublePredicate{
								DoublePredicate: &audience.DoublePredicate{
									Op:            audience.DoublePredicate_IS_NOT_EQUAL,
									AttributeName: "viscosity",
									Value:         1.3145111,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is greater than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_DoublePredicate{
								DoublePredicate: &audience.DoublePredicate{
									Op:            audience.DoublePredicate_IS_GREATER_THAN,
									AttributeName: "viscosity",
									Value:         1.1,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is less than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_DoublePredicate{
								DoublePredicate: &audience.DoublePredicate{
									Op:            audience.DoublePredicate_IS_LESS_THAN,
									AttributeName: "viscosity",
									Value:         999999.99999,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
		{
			name: "is between",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_DoublePredicate{
								DoublePredicate: &audience.DoublePredicate{
									Op:            audience.DoublePredicate_IS_BETWEEN,
									AttributeName: "viscosity",
									Value:         0.1,
									Value2:        838383.3838,
								},
							},
						},
					},
				},
			},
			profile: identifiedProfile(t),
			device:  nil,

			exp:    true,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_DurationPredicates(t *testing.T) {
	predicates.TimeNow = func() time.Time {
		return time.Date(2013, 6, 7, 1, 15, 0, 0, time.UTC)
	}

	var (
		p  = identifiedProfile(t)
		d  = device2(t, p.GetId())
		d1 = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			/*
				2013-06-07T01:15:00 to local timezone is 2013-06-06T21:15:00
				2013-06-06T21:15:00 minus 1 day = 2013-06-05T21:15:00
				Floor 2013-06-05T21:15:00 -> 2013-06-05T00:00:00
				Convert to timezone -> 2013-06-05T04:00:00
				2013-06-05T04:00:00 < 2013-06-06T14:15:43Z <= 2013-06-06T04:00:00
			*/
			name: "2013-06-06T14:15:43Z is not on 2013-06-07T01:15:00-04:00 minus 1 day",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DurationPredicate{
								DurationPredicate: &audience.DurationPredicate{
									Op:            audience.DurationPredicate_IS_EQUAL,
									AttributeName: "created_at",
									Value: &audience.DurationPredicate_Duration{
										Type:     audience.DurationPredicate_Duration_DAYS,
										Duration: 1,
									},
								},
							},
						},
					},
				},
			},
			profile: &audience.Profile{},
			device: &audience.Device{
				CreatedAt: protoTs(t, parseTime(t, "2013-06-06T14:15:43Z")),
			},

			exp:    false,
			expErr: nil,
		},
		{
			name: "1999-10-20T14:10:43.678Z is before 2013-06-07T01:15:00-04:00 minus 2 days",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DurationPredicate{
								DurationPredicate: &audience.DurationPredicate{
									Op:            audience.DurationPredicate_IS_LESS_THAN,
									AttributeName: "created_at",
									Value: &audience.DurationPredicate_Duration{
										Type:     audience.DurationPredicate_Duration_DAYS,
										Duration: 2,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,

			exp:    true,
			expErr: nil,
		},
		{
			name: "2013-06-05T14:10:43.678Z is after 2013-06-07T01:15:00-04:00 minus 3 days",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DurationPredicate{
								DurationPredicate: &audience.DurationPredicate{
									Op:            audience.DurationPredicate_IS_GREATER_THAN,
									AttributeName: "created_at",
									Value: &audience.DurationPredicate_Duration{
										Type:     audience.DurationPredicate_Duration_DAYS,
										Duration: 3,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d1,

			exp:    true,
			expErr: nil,
		},
		{
			/*
				2013-06-07T01:15:00 convert to local time is 2013-06-06T21:15:00
				2013-06-06T21:15:00 minus 2 day = 2013-06-04T21:15:00
				Floor 2013-06-04T21:15:00 -> 2013-06-04T00:00:00
				Convert to timezone -> 2013-06-04T04:00:00
				2013-06-04T04:00:00 < 2013-06-04T14:10:43.678Z <= 2013-06-05T04:00:00
			*/
			name: "2013-06-04T14:10:43.678Z is on 2013-06-07T10:15:00-04:00 minus 2 days",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DurationPredicate{
								DurationPredicate: &audience.DurationPredicate{
									Op:            audience.DurationPredicate_IS_EQUAL,
									AttributeName: "created_at",
									Value: &audience.DurationPredicate_Duration{
										Type:     audience.DurationPredicate_Duration_DAYS,
										Duration: 2,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device: &audience.Device{
				CreatedAt: protoTs(t, parseTime(t, "2013-06-04T14:10:43.678Z")),
			},

			exp:    true,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_DatePredicates(t *testing.T) {
	predicates.TimeNow = func() time.Time {
		return time.Date(2013, 6, 7, 1, 15, 0, 0, time.UTC)
	}

	var (
		p = identifiedProfile(t)
		d = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DatePredicate{
								DatePredicate: &audience.DatePredicate{
									Op:            audience.DatePredicate_IS_SET,
									AttributeName: "created_at",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is un set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DatePredicate{
								DatePredicate: &audience.DatePredicate{
									Op:            audience.DatePredicate_IS_UNSET,
									AttributeName: "created_at",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "2013-06-05T14:10:43.678Z is after 2011-11-31 04:00:00",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DatePredicate{
								DatePredicate: &audience.DatePredicate{
									Op:            audience.DatePredicate_IS_AFTER,
									AttributeName: "created_at",
									Value:         &audience.DatePredicate_Date{Day: 31, Month: 11, Year: 2011},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,

			exp:    true,
			expErr: nil,
		},
		{
			name: "2013-06-05T14:10:43.678Z is before 2013-06-06 04:00:00",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DatePredicate{
								DatePredicate: &audience.DatePredicate{
									Op:            audience.DatePredicate_IS_BEFORE,
									AttributeName: "created_at",
									Value:         &audience.DatePredicate_Date{Day: 6, Month: 6, Year: 2013},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,

			exp:    true,
			expErr: nil,
		},
		{
			name: "2013-06-05T14:10:43.678Z is between 2013-06-05 04:00:00 and 2013-06-06 04:00:00",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_DatePredicate{
								DatePredicate: &audience.DatePredicate{
									Op:            audience.DatePredicate_IS_ON,
									AttributeName: "created_at",
									Value:         &audience.DatePredicate_Date{Day: 5, Month: 6, Year: 2013},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,

			exp:    true,
			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_VersionPredicates(t *testing.T) {
	var (
		p = identifiedProfile(t)
		d = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_EQUAL,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    1,
										Minor:    1,
										Revision: 2,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is not equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_NOT_EQUAL,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    9,
										Minor:    9,
										Revision: 9,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is greater than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_GREATER_THAN,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    0,
										Minor:    0,
										Revision: 1,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is less than",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_LESS_THAN,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    9,
										Minor:    9,
										Revision: 9,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is less than or equal",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_LESS_THAN_OR_EQUAL,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    9,
										Minor:    9,
										Revision: 9,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is greater than or equal (should exactly equal)",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_GREATER_THAN_OR_EQUAL,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    1,
										Minor:    1,
										Revision: 2,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is greater than or equal (should be greater than)",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_GREATER_THAN_OR_EQUAL,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    0,
										Minor:    0,
										Revision: 1,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is between",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_BETWEEN,
									AttributeName: "sdk_version",
									Value: &audience.Version{
										Major:    0,
										Minor:    0,
										Revision: 1,
									},
									Value2: &audience.Version{
										Major:    5,
										Minor:    3,
										Revision: 22,
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_SET,
									AttributeName: "sdk_version",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is not set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									Op:            audience.VersionPredicate_IS_UNSET,
									AttributeName: "sdk_version",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_GeofencePredicates(t *testing.T) {
	var (
		p = identifiedProfile(t)
		d = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "is set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_SET,
									AttributeName: "location",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is un set",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_UNSET,
									AttributeName: "location",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "is within",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_WITHIN,
									AttributeName: "location",
									Value: &audience.GeofencePredicate_Location{
										Latitude:  43.650737,
										Longitude: -79.375877,
										Radius:    500,
										Name:      "Rover HQ",
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is within ( false )",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_WITHIN,
									AttributeName: "location",
									Value: &audience.GeofencePredicate_Location{
										Latitude:  39.030458,
										Longitude: 125.753960,
										Radius:    1500,
										Name:      "North Korea",
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "is outside",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_OUTSIDE,
									AttributeName: "location",
									Value: &audience.GeofencePredicate_Location{
										Latitude:  39.030458,
										Longitude: 125.753960,
										Radius:    1500,
										Name:      "North Korea",
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "is outside (false)",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_OUTSIDE,
									AttributeName: "location",
									Value: &audience.GeofencePredicate_Location{
										Latitude:  43.650737,
										Longitude: -79.375877,
										Radius:    500,
										Name:      "Rover HQ",
									},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_StringArrayPredicates(t *testing.T) {
	var (
		p = identifiedProfile(t)
		d = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "contains any nil value",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_CONTAINS_ANY,
									AttributeName: "BADATTRIBUTE",
									Value:         []string{"test"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "contains any",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_CONTAINS_ANY,
									AttributeName: "tags",
									Value:         []string{"a", "hello"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "does not contain any",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_DOES_NOT_CONTAIN_ANY,
									AttributeName: "tags",
									Value:         []string{"a", "hello"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "contains all",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_CONTAINS_ALL,
									AttributeName: "tags",
									Value:         []string{"a", "b", "c"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "contains all (false)",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_CONTAINS_ALL,
									AttributeName: "tags",
									Value:         []string{"a", "hello"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
		{
			name: "does not contain all",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL,
									AttributeName: "tags",
									Value:         []string{"a", "b", "d"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "does not contain all (false)",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringArrayPredicate{
								StringArrayPredicate: &audience.StringArrayPredicate{
									Op:            audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL,
									AttributeName: "tags",
									Value:         []string{"a", "b", "c"},
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     false,
			expErr:  nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testPredicates_ComplexPredicates(t *testing.T) {
	var (
		p = identifiedProfile(t)
		d = device(t, p.GetId())
	)

	tcases := []struct {
		name    string
		segment *audience.DynamicSegment
		device  *audience.Device
		profile *audience.Profile

		exp    bool
		expErr error
	}{
		{
			name: "device is located at RoverHQ and its profile's first-name starts with bill",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ALL,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_GeofencePredicate{
								GeofencePredicate: &audience.GeofencePredicate{
									Op:            audience.GeofencePredicate_IS_SET,
									AttributeName: "location",
								},
							},
						},
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									AttributeName: "first-name",
									Op:            audience.StringPredicate_STARTS_WITH,
									Value:         "bill",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "device sdk-version is greater than 2.0.0 or profile age is equal to 36",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ANY,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_VersionPredicate{
								VersionPredicate: &audience.VersionPredicate{
									AttributeName: "sdk_version",
									Op:            audience.VersionPredicate_IS_GREATER_THAN,
									Value: &audience.Version{
										Major:    2,
										Minor:    0,
										Revision: 0,
									},
								},
							},
						},
						{
							Selector: audience.Predicate_CUSTOM_PROFILE,
							Value: &audience.Predicate_NumberPredicate{
								NumberPredicate: &audience.NumberPredicate{
									AttributeName: "age",
									Op:            audience.NumberPredicate_IS_EQUAL,
									Value:         36,
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
		{
			name: "device label is set and is_test_device is true",
			segment: &audience.DynamicSegment{
				PredicateAggregate: &audience.PredicateAggregate{
					Condition: audience.PredicateAggregate_ANY,
					Predicates: []*audience.Predicate{
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_BoolPredicate{
								BoolPredicate: &audience.BoolPredicate{
									Op:            audience.BoolPredicate_IS_EQUAL,
									AttributeName: "is_test_device",
									Value:         true,
								},
							},
						},
						{
							Selector: audience.Predicate_DEVICE,
							Value: &audience.Predicate_StringPredicate{
								StringPredicate: &audience.StringPredicate{
									Op:            audience.StringPredicate_IS_EQUAL,
									AttributeName: "label",
									Value:         "my little label",
								},
							},
						},
					},
				},
			},
			profile: p,
			device:  d,
			exp:     true,
			expErr:  nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = predicates.IsInDynamicSegment(tc.segment, tc.device, tc.profile)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func difff(diff []string) string {
	return strings.Join(diff, "\n")
}

func Diff(exp, got interface{}, expErr, gotErr error) []string {
	diffFn := deepDiff
	if os.Getenv("JSONDIFF") != "" {
		diffFn = jsonDiff
	}
	return diffFn(exp, got, expErr, gotErr)
}

func deepDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		return deep.Equal(expErr, gotErr)
	}

	return deep.Equal(exp, got)
}

func jsonDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		if !reflect.DeepEqual(expErr, gotErr) {
			return []string{
				fmt.Sprintf("%+v", expErr),
				fmt.Sprintf("%+v", gotErr),
			}
		}

		// error case skip the rest
		return nil
	}

	jsonStr := func(v interface{}) string {
		b, err := json.Marshal(v)
		if err != nil {
			panic(err)
		}

		var out bytes.Buffer
		json.Indent(&out, b, "", "  ")
		return out.String()
	}

	_ = jsonStr

	diffstr, err := diffCmd(jsonStr(exp), jsonStr(got))
	if err != nil {
		panic(err)
	}

	if !reflect.DeepEqual(exp, got) {
		// var diff, err := json.Marsha
		return []string{
			diffstr,
			// jsonStr(exp),
			// jsonStr(got),
		}
	}

	return nil
}

func diffCmd(exp, got string) (string, error) {
	fa, err := ioutil.TempFile("", "exp")
	if err != nil {
		return "", err
	}
	defer fa.Close()

	fb, err := ioutil.TempFile("", "got")
	if err != nil {
		return "", err
	}
	defer fb.Close()

	if _, err := fa.WriteString(exp + "\n"); err != nil {
		return "", err
	}
	if _, err := fb.WriteString(got + "\n"); err != nil {
		return "", err
	}
	fa.Sync()
	fb.Sync()

	cmd := exec.Command("diff", fa.Name(), fb.Name())
	data, err := cmd.Output()
	if err == exec.ErrNotFound {
		return "", err
	}

	return string(data), nil
}

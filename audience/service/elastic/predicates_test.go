package elastic

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/go-test/deep"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"io/ioutil"
	"os"
	"os/exec"
	"reflect"
	"strings"
	"testing"
	"time"
)

func TestPredicates(t *testing.T) {
	defer func() {
		TimeNow = time.Now
	}()
	TimeNow = func() time.Time {
		return time.Date(2013, 6, 7, 1, 15, 0, 0, time.UTC)
	}
	t.Run("StringPredicateToFilter", test_StringPredicatesToFilter)
	t.Run("BoolPredicateToFilter", test_BoolPredicateToFilter)
	t.Run("NumberPredicateToFilter", test_NumberPredicateToFilter)
	t.Run("VersionPredicateToFilter", test_VersionPredicateToFilter)
	t.Run("GeofencePredicateToFilter", test_GeofencePredicateToFilter)
	t.Run("DoublePredicateToFilter", test_DoublePredicateToFilter)
	t.Run("StringArrayPredicateToFilter", test_StringArrayPredicateToFilter)
	t.Run("DevicePredicateAggregateToQuery", test_DevicePredicateAggregateToQuery)
	t.Run("DeviceAndProfilePredicateAggregateToQuery", test_DeviceAndProfilePredicateAggregateToQuery)
	t.Run("DatePredicateToFilter", test_DatePredicateToFilter)
	t.Run("DurationPredicateToFilter", test_DurationPredicateToFilter)
}

func getJSON(t *testing.T, in map[string]interface{}) []byte {
	out, err := json.Marshal(in)
	if err != nil {
		t.Fatalf("Unable to convert map[string]interface{} to JSON, err: %v", err)
	}

	return out
}

func parseJSON(t *testing.T, in []byte) M {
	var out M
	err := json.Unmarshal(in, &out)
	if err != nil {
		t.Fatalf("Unable to parse JSON, err: %v", err)
	}

	return out
}

func areEqualJSON(s1, s2 []byte) (bool, error) {
	var o1 interface{}
	var o2 interface{}

	var err error
	err = json.Unmarshal(s1, &o1)
	if err != nil {
		return false, fmt.Errorf("Error mashalling string 1 :: %s", err.Error())
	}
	err = json.Unmarshal(s2, &o2)
	if err != nil {
		return false, fmt.Errorf("Error mashalling string 2 :: %s", err.Error())
	}

	return reflect.DeepEqual(o1, o2), nil
}

func test_DatePredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition
		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a must exists query when IS_SET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DatePredicate{
					DatePredicate: &audience.DatePredicate{
						Op:            audience.DatePredicate_IS_SET,
						AttributeName: "created_at",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"exists": M{
									"field": "created_at",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not exists query when IS_UNSET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DatePredicate{
					DatePredicate: &audience.DatePredicate{
						Op:            audience.DatePredicate_IS_UNSET,
						AttributeName: "created_at",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"exists": M{
									"field": "created_at",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_AFTER",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DatePredicate{
					DatePredicate: &audience.DatePredicate{
						Op:            audience.DatePredicate_IS_AFTER,
						AttributeName: "created_at",
						Value:         &audience.DatePredicate_Date{Day: 8, Month: 2, Year: 1993},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"gt":        "1993-02-08||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_BEFORE",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DatePredicate{
					DatePredicate: &audience.DatePredicate{
						Op:            audience.DatePredicate_IS_BEFORE,
						AttributeName: "created_at",
						Value:         &audience.DatePredicate_Date{Day: 8, Month: 2, Year: 1993},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"lt":        "1993-02-08||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_ON",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DatePredicate{
					DatePredicate: &audience.DatePredicate{
						Op:            audience.DatePredicate_IS_ON,
						AttributeName: "created_at",
						Value:         &audience.DatePredicate_Date{Day: 8, Month: 2, Year: 1993},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"gte":       "1993-02-08||/d",
										"lt":        "1993-02-09||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_DurationPredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition
		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a range query when is IS_LESS_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DurationPredicate{
					DurationPredicate: &audience.DurationPredicate{
						Op:            audience.DurationPredicate_IS_LESS_THAN,
						AttributeName: "created_at",
						Value: &audience.DurationPredicate_Duration{
							Duration: 0,
							Type:     audience.DurationPredicate_Duration_DAYS,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"lt":        "2013-06-06||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_GREATER_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DurationPredicate{
					DurationPredicate: &audience.DurationPredicate{
						Op:            audience.DurationPredicate_IS_GREATER_THAN,
						AttributeName: "created_at",
						Value: &audience.DurationPredicate_Duration{
							Duration: 1,
							Type:     audience.DurationPredicate_Duration_DAYS,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"gt":        "2013-06-05||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DurationPredicate{
					DurationPredicate: &audience.DurationPredicate{
						Op:            audience.DurationPredicate_IS_EQUAL,
						AttributeName: "created_at",
						Value: &audience.DurationPredicate_Duration{
							Duration: 2,
							Type:     audience.DurationPredicate_Duration_DAYS,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"created_at": M{
										"lt":        "2013-06-05||/d",
										"gte":       "2013-06-04||/d",
										"time_zone": Zone,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_StringPredicatesToFilter(t *testing.T) {

	tcases := []struct {
		name      string
		predicate *audience.Predicate
		condition audience.PredicateAggregate_Condition

		exp    M
		expErr error
	}{
		{
			name:      "uses a must term query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_EQUAL,
						AttributeName: "push_token_key",
						Value:         "hello",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"push_token_key": "hello",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must not term query when IS_NOT_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_NOT_EQUAL,
						AttributeName: "push_token_key",
						Value:         "hello",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"push_token_key": "hello",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not term query when IS_SET is used on an attribute who's missing value is blank string",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_SET,
						AttributeName: "push_token_key",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"push_token_key": "",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must term query when IS_UNSET is used on an attribute who's missing value is blank string",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_UNSET,
						AttributeName: "push_token_key",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"push_token_key": "",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must exists query when IS_SET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_SET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not exists query when IS_UNSET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_UNSET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must prefix query when STARTS_WITH",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_STARTS_WITH,
						AttributeName: "push_token_key",
						Value:         "bill",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"prefix": M{
									"push_token_key": "bill",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must wildcard query when ENDS_WITH",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_ENDS_WITH,
						AttributeName: "push_token_key",
						Value:         "bill",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"must": []M{
							{
								"wildcard": M{
									"push_token_key": "*bill",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must wildcard query when CONTAINS",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_CONTAINS,
						AttributeName: "push_token_key",
						Value:         "bill",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"must": []M{
							{
								"wildcard": M{
									"push_token_key": "*bill*",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not wildcard query when CONTAINS",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_DOES_NOT_CONTAIN,
						AttributeName: "push_token_key",
						Value:         "bill",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"wildcard": M{
									"push_token_key": "*bill*",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "wraps must query when IS_EQUAL in a should query when selector is ANY",
			condition: audience.PredicateAggregate_ANY,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_EQUAL,
						AttributeName: "push_token_key",
						Value:         "hello",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"should": []M{
							{
								"term": M{
									"push_token_key": "hello",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "wraps must_not query when IS_NOT_EQUAL in a should query when selector is ANY",
			condition: audience.PredicateAggregate_ANY,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_StringPredicate{
					StringPredicate: &audience.StringPredicate{
						Op:            audience.StringPredicate_IS_NOT_EQUAL,
						AttributeName: "push_token_key",
						Value:         "hello",
					},
				},
			},

			exp: M{

				"filter": M{
					"bool": M{
						"should": []M{
							{
								"bool": M{
									"must_not": []M{
										{
											"term": M{
												"push_token_key": "hello",
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_BoolPredicateToFilter(t *testing.T) {

	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition
		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a must term query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_BoolPredicate{
					BoolPredicate: &audience.BoolPredicate{
						Op:            audience.BoolPredicate_IS_EQUAL,
						AttributeName: "is_wifi_enabled",
						Value:         true,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"is_wifi_enabled": true,
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must term query when IS_SET is used on an attribute who's missing value is null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_BoolPredicate{
					BoolPredicate: &audience.BoolPredicate{
						Op:            audience.BoolPredicate_IS_SET,
						AttributeName: "is_canadian",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"exists": M{
									"field": "attributes.is_canadian",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not term query when IS_SET is used on an attribute who's missing value is null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_BoolPredicate{
					BoolPredicate: &audience.BoolPredicate{
						Op:            audience.BoolPredicate_IS_UNSET,
						AttributeName: "is_canadian",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"exists": M{
									"field": "attributes.is_canadian",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "wraps must query when IS_EQUAL in a should query when selector is ANY",
			condition: audience.PredicateAggregate_ANY,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_BoolPredicate{
					BoolPredicate: &audience.BoolPredicate{
						Op:            audience.BoolPredicate_IS_EQUAL,
						AttributeName: "is_wifi_enabled",
						Value:         true,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"should": []M{
							{
								"term": M{
									"is_wifi_enabled": true,
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_NumberPredicateToFilter(t *testing.T) {

	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition

		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a must term query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_EQUAL,
						AttributeName: "screen_width",
						Value:         100,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"screen_width": int64(100),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must not term query when IS_NOT_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_NOT_EQUAL,
						AttributeName: "screen_width",
						Value:         100,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"screen_width": int64(100),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not term query when IS_SET is used on an attribute who's missing value is 0",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_SET,
						AttributeName: "screen_width",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"screen_width": int64(0),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must term query when IS_UNSET is used on an attribute who's missing value is 0",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_UNSET,
						AttributeName: "screen_width",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"screen_width": int64(0),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must exists query when IS_SET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_SET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not exists query when IS_UNSET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_UNSET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_GREATER_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_GREATER_THAN,
						AttributeName: "screen_height",
						Value:         200,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"screen_height": M{
										"gt": int64(200),
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_LESS_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_LESS_THAN,
						AttributeName: "screen_height",
						Value:         200,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"screen_height": M{
										"lt": int64(200),
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_BETWEEN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_NumberPredicate{
					NumberPredicate: &audience.NumberPredicate{
						Op:            audience.NumberPredicate_IS_BETWEEN,
						AttributeName: "screen_height",
						Value:         124,
						Value2:        800,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"screen_height": M{
										"gte": int64(124),
										"lte": int64(800),
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_VersionPredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition

		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a must term query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_VersionPredicate{
					VersionPredicate: &audience.VersionPredicate{
						Op:            audience.VersionPredicate_IS_EQUAL,
						AttributeName: "sdk_version",
						Value: &audience.Version{
							Major:    1,
							Minor:    2,
							Revision: 3,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"bool": M{
									"must": []M{
										{
											"term": M{
												"sdk_version.major": int32(1),
											},
										},
										{
											"term": M{
												"sdk_version.minor": int32(2),
											},
										},
										{
											"term": M{
												"sdk_version.revision": int32(3),
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not term query when is IS_NOT_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_VersionPredicate{
					VersionPredicate: &audience.VersionPredicate{
						Op:            audience.VersionPredicate_IS_NOT_EQUAL,
						AttributeName: "sdk_version",
						Value: &audience.Version{
							Major:    1,
							Minor:    2,
							Revision: 3,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"bool": M{
									"must": []M{
										{
											"term": M{
												"sdk_version.major": int32(1),
											},
										},
										{
											"term": M{
												"sdk_version.minor": int32(2),
											},
										},
										{
											"term": M{
												"sdk_version.revision": int32(3),
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_GREATER_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_VersionPredicate{
					VersionPredicate: &audience.VersionPredicate{
						Op:            audience.VersionPredicate_IS_GREATER_THAN,
						AttributeName: "sdk_version",
						Value: &audience.Version{
							Major:    1,
							Minor:    2,
							Revision: 3,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"bool": M{
									"should": []M{
										{
											"range": M{
												"sdk_version.major": M{
													"gt": int32(1),
												},
											},
										},
										{
											"bool": M{
												"must": []M{
													{
														"term": M{
															"sdk_version.major": int32(1),
														},
													},
													{
														"range": M{
															"sdk_version.minor": M{
																"gt": int32(2),
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
															"sdk_version.major": int32(1),
														},
													},
													{
														"term": M{
															"sdk_version.minor": int32(2),
														},
													},
													{
														"range": M{
															"sdk_version.revision": M{
																"gt": int32(3),
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when is IS_LESS_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_VersionPredicate{
					VersionPredicate: &audience.VersionPredicate{
						Op:            audience.VersionPredicate_IS_LESS_THAN,
						AttributeName: "sdk_version",
						Value: &audience.Version{
							Major:    1,
							Minor:    2,
							Revision: 3,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"bool": M{
									"should": []M{
										{
											"range": M{
												"sdk_version.major": M{
													"lt": int32(1),
												},
											},
										},
										{
											"bool": M{
												"must": []M{
													{
														"term": M{
															"sdk_version.major": int32(1),
														},
													},
													{
														"range": M{
															"sdk_version.minor": M{
																"lt": int32(2),
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
															"sdk_version.major": int32(1),
														},
													},
													{
														"term": M{
															"sdk_version.minor": int32(2),
														},
													},
													{
														"range": M{
															"sdk_version.revision": M{
																"lt": int32(3),
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a range query when IS_BETWEEN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_VersionPredicate{
					VersionPredicate: &audience.VersionPredicate{
						Op:            audience.VersionPredicate_IS_BETWEEN,
						AttributeName: "sdk_version",
						Value: &audience.Version{
							Major:    1,
							Minor:    2,
							Revision: 3,
						},
						Value2: &audience.Version{
							Major:    2,
							Minor:    1,
							Revision: 3,
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"bool": M{
									"should": []M{
										{
											"range": M{
												"sdk_version.major": M{
													"gt": int32(1),
													"lt": int32(2),
												},
											},
										},
										{
											"bool": M{
												"must": []M{
													{
														"term": M{
															"sdk_version.major": int32(1),
														},
													},
													{
														"range": M{
															"sdk_version.minor": M{
																"gt": int32(2),
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
															"sdk_version.major": int32(1),
														},
													},
													{
														"term": M{
															"sdk_version.minor": int32(2),
														},
													},
													{
														"range": M{
															"sdk_version.revision": M{
																"gte": int32(3),
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
															"sdk_version.major": int32(2),
														},
													},
													{
														"range": M{
															"sdk_version.minor": M{
																"lt": int32(1),
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
															"sdk_version.major": int32(2),
														},
													},
													{
														"term": M{
															"sdk_version.minor": int32(1),
														},
													},
													{
														"range": M{
															"sdk_version.revision": M{
																"lte": int32(3),
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_GeofencePredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition

		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a geo_distance must filter when IS_WITHIN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_GeofencePredicate{
					GeofencePredicate: &audience.GeofencePredicate{
						Op:            audience.GeofencePredicate_IS_WITHIN,
						AttributeName: "location",
						Value: &audience.GeofencePredicate_Location{
							Latitude:  27.1750,
							Longitude: 78.0422,
							Radius:    1000,
							Name:      "Taj Mahal",
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"geo_distance": M{
									"distance": "1000m",
									"location": M{
										"lat": 27.1750,
										"lon": 78.0422,
									},
								},
							},
						},
					},
				},
			},
		},
		{
			name:      "uses a geo_distance must_not filter when IS_OUTSIDE",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_GeofencePredicate{
					GeofencePredicate: &audience.GeofencePredicate{
						Op:            audience.GeofencePredicate_IS_OUTSIDE,
						AttributeName: "location",
						Value: &audience.GeofencePredicate_Location{
							Latitude:  22.9519,
							Longitude: 43.2105,
							Radius:    129,
							Name:      "Christ the Redeemer",
						},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"geo_distance": M{
									"distance": "129m",
									"location": M{
										"lat": 22.9519,
										"lon": 43.2105,
									},
								},
							},
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_DoublePredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition

		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a must term query when is IS_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_EQUAL,
						AttributeName: "location_latitude",
						Value:         44.4,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"location_latitude": 44.4,
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must not term query when IS_NOT_EQUAL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_NOT_EQUAL,
						AttributeName: "location_latitude",
						Value:         23.123,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"location_latitude": 23.123,
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not term query when IS_SET is used on an attribute who's missing value is 0",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_SET,
						AttributeName: "location_latitude",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"term": M{
									"location_latitude": float64(0),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must term query when IS_UNSET is used on an attribute who's missing value is 0",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_UNSET,
						AttributeName: "location_latitude",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"term": M{
									"location_latitude": float64(0),
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must exists query when IS_SET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_SET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not exists query when IS_UNSET is used on an attribute who's missing value null",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_UNSET,
						AttributeName: "age",
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"exists": M{
									"field": "attributes.age",
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_GREATER_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_GREATER_THAN,
						AttributeName: "location_latitude",
						Value:         24.229292,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"location_latitude": M{
										"gt": 24.229292,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_LESS_THAN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_LESS_THAN,
						AttributeName: "location_latitude",
						Value:         43.44,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"location_latitude": M{
										"lt": 43.44,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must range query when IS_BETWEEN",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_DEVICE,
				Value: &audience.Predicate_DoublePredicate{
					DoublePredicate: &audience.DoublePredicate{
						Op:            audience.DoublePredicate_IS_BETWEEN,
						AttributeName: "location_latitude",
						Value:         1.11,
						Value2:        99.23,
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"range": M{
									"location_latitude": M{
										"gte": 1.11,
										"lte": 99.23,
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_StringArrayPredicateToFilter(t *testing.T) {
	tcases := []struct {
		name      string
		condition audience.PredicateAggregate_Condition

		predicate *audience.Predicate

		exp    M
		expErr error
	}{
		{
			name:      "uses a sub bool query with a term match for each value in list when CONTAINS_ALL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringArrayPredicate{
					StringArrayPredicate: &audience.StringArrayPredicate{
						Op:            audience.StringArrayPredicate_CONTAINS_ALL,
						AttributeName: "tags",
						Value:         []string{"bob", "billy"},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"bool": M{
									"must": []M{
										{
											"term": M{
												"attributes.tags": "bob",
											},
										},
										{
											"term": M{
												"attributes.tags": "billy",
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a must_not sub bool query with a term match for each value in list when DOES_NOT_CONTAIN_ALL",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringArrayPredicate{
					StringArrayPredicate: &audience.StringArrayPredicate{
						Op:            audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL,
						AttributeName: "tags",
						Value:         []string{"hank", "frank"},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"bool": M{
									"should": []M{
										{
											"term": M{
												"attributes.tags": "hank",
											},
										},
										{
											"term": M{
												"attributes.tags": "frank",
											},
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a simple must terms filter when CONTAINS_ANY",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringArrayPredicate{
					StringArrayPredicate: &audience.StringArrayPredicate{
						Op:            audience.StringArrayPredicate_CONTAINS_ANY,
						AttributeName: "tags",
						Value:         []string{"leo", "tucker"},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must": []M{
							{
								"terms": M{
									"attributes.tags": []string{"leo", "tucker"},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name:      "uses a simple must_not terms filter when DOES_NOT_CONTAIN_ANY",
			condition: audience.PredicateAggregate_ALL,

			predicate: &audience.Predicate{
				Selector: audience.Predicate_CUSTOM_PROFILE,
				Value: &audience.Predicate_StringArrayPredicate{
					StringArrayPredicate: &audience.StringArrayPredicate{
						Op:            audience.StringArrayPredicate_DOES_NOT_CONTAIN_ANY,
						AttributeName: "tags",
						Value:         []string{"leo", "tucker"},
					},
				},
			},

			exp: M{
				"filter": M{
					"bool": M{
						"must_not": []M{
							{
								"terms": M{
									"attributes.tags": []string{"leo", "tucker"},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var p = []*audience.Predicate{tc.predicate}
			var got, gotErr = PredicatesToFilter(tc.condition, p)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_DevicePredicateAggregateToQuery(t *testing.T) {
	tcases := []struct {
		name      string
		aggregate *audience.PredicateAggregate

		exp    M
		expErr error
	}{
		{
			name: "Uses a root query object",
			aggregate: &audience.PredicateAggregate{
				Condition: audience.PredicateAggregate_ALL,
				Predicates: []*audience.Predicate{
					{
						Selector: audience.Predicate_DEVICE,
						Value: &audience.Predicate_StringPredicate{
							StringPredicate: &audience.StringPredicate{
								Op:            audience.StringPredicate_IS_EQUAL,
								AttributeName: "os_name",
								Value:         "iOS",
							},
						},
					},
				},
			},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{
								"must": []M{
									{
										"term": M{
											"os_name": "iOS",
										},
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},

		{
			name: "Filters out predicates who's selector is not Predicate_DEVICE",
			aggregate: &audience.PredicateAggregate{
				Condition: audience.PredicateAggregate_ALL,
				Predicates: []*audience.Predicate{
					{
						Selector: audience.Predicate_CUSTOM_PROFILE,
						Value: &audience.Predicate_StringPredicate{
							StringPredicate: &audience.StringPredicate{
								Op:            audience.StringPredicate_IS_EQUAL,
								AttributeName: "os_name",
								Value:         "iOS",
							},
						},
					},
				},
			},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{},
						},
					},
				},
			},

			expErr: nil,
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			var got, gotErr = DevicePredicateAggregateToQuery(tc.aggregate)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func test_DeviceAndProfilePredicateAggregateToQuery(t *testing.T) {
	tcases := []struct {
		name      string
		aggregate *audience.PredicateAggregate
		offset    *audience.QueryRequest_TimeZoneOffset

		exp    M
		expErr error
	}{
		{
			name: "Uses a root query object and includes empty match_parent when no profile predicates are defined",
			aggregate: &audience.PredicateAggregate{
				Condition: audience.PredicateAggregate_ALL,
				Predicates: []*audience.Predicate{
					{
						Selector: audience.Predicate_DEVICE,
						Value: &audience.Predicate_StringPredicate{
							StringPredicate: &audience.StringPredicate{
								Op:            audience.StringPredicate_IS_EQUAL,
								AttributeName: "os_name",
								Value:         "iOS",
							},
						},
					},
				},
			},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{
								"must": []M{
									{
										"term": M{
											"os_name": "iOS",
										},
									},
									{
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
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},

		{
			name: "uses a root query object with the match_parent filled out",
			aggregate: &audience.PredicateAggregate{
				Condition: audience.PredicateAggregate_ALL,
				Predicates: []*audience.Predicate{
					{
						Selector: audience.Predicate_CUSTOM_PROFILE,
						Value: &audience.Predicate_StringPredicate{
							StringPredicate: &audience.StringPredicate{
								Op:            audience.StringPredicate_IS_EQUAL,
								AttributeName: "first-name",
								Value:         "Bob",
							},
						},
					},
					{
						Selector: audience.Predicate_DEVICE,
						Value: &audience.Predicate_BoolPredicate{
							BoolPredicate: &audience.BoolPredicate{
								Op:            audience.BoolPredicate_IS_EQUAL,
								AttributeName: "is_wifi_enabled",
								Value:         true,
							},
						},
					},
				},
			},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{
								"must": []M{
									{
										"term": M{
											"is_wifi_enabled": true,
										},
									},
									{
										"has_parent": M{
											"parent_type": "profile",
											"query": M{
												"bool": M{
													"filter": M{
														"term": M{
															"attributes.first-name": "Bob",
														},
													},
												},
											},
										},
									},
									{
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
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		{
			name: "wraps profile should query in has_parent",
			aggregate: &audience.PredicateAggregate{
				Condition: audience.PredicateAggregate_ANY,
				Predicates: []*audience.Predicate{
					{
						Selector: audience.Predicate_CUSTOM_PROFILE,
						Value: &audience.Predicate_StringPredicate{
							StringPredicate: &audience.StringPredicate{
								Op:            audience.StringPredicate_IS_EQUAL,
								AttributeName: "first-name",
								Value:         "Bob",
							},
						},
					},
					{
						Selector: audience.Predicate_CUSTOM_PROFILE,
						Value: &audience.Predicate_NumberPredicate{
							NumberPredicate: &audience.NumberPredicate{
								Op:            audience.NumberPredicate_IS_BETWEEN,
								AttributeName: "age",
								Value:         1,
								Value2:        10,
							},
						},
					},
				},
			},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{
								"should": []M{
									{
										"has_parent": M{
											"parent_type": "profile",
											"query": M{
												"bool": M{
													"filter": M{
														"term": M{
															"attributes.first-name": "Bob",
														},
													},
												},
											},
										},
									},
									{
										"has_parent": M{
											"parent_type": "profile",
											"query": M{
												"bool": M{
													"filter": M{
														"range": M{
															"attributes.age": M{
																"gte": int64(1),
																"lte": int64(10),
															},
														},
													},
												},
											},
										},
									},
								},
								"must": []M{
									{
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
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		/* TODO stub out time.Now() in zoneinfo to have a consistent return
		{
			name: "Adds a timezone filter",
			aggregate: &audience.PredicateAggregate{
				Condition:  audience.PredicateAggregate_ALL,
				Predicates: []*audience.Predicate{},
			},
			offset: &audience.QueryRequest_TimeZoneOffset{Seconds: 0},

			exp: M{
				"query": M{
					"bool": M{
						"filter": M{
							"bool": M{
								"must": []M{
									{
										"terms": M{
											"time_zone": []string{
												"Africa/Abidjan",
												"Africa/Accra",
												"Africa/Bamako",
												"Africa/Banjul",
												"Africa/Bissau",
												"Africa/Conakry",
												"Africa/Dakar",
												"Africa/Freetown",
												"Africa/Lome",
												"Africa/Monrovia",
												"Africa/Nouakchott",
												"Africa/Ouagadougou",
												"Africa/Sao_Tome",
												"Africa/Timbuktu",
												"America/Danmarkshavn",
												"America/Scoresbysund",
												"Atlantic/Azores",
												"Atlantic/Reykjavik",
												"Atlantic/St_Helena",
												"Etc/GMT",
												"Etc/GMT+0",
												"Etc/GMT-0",
												"Etc/GMT0",
												"Etc/Greenwich",
												"Etc/UCT",
												"Etc/Universal",
												"Etc/UTC",
												"Etc/Zulu",
												"GMT",
												"GMT+0",
												"GMT-0",
												"GMT0",
												"Greenwich",
												"Iceland",
												"UCT",
												"Universal",
												"UTC",
												"Zulu",
											},
										},
									},
									{
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
									},
								},
							},
						},
					},
				},
			},

			expErr: nil,
		},
		*/
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = DeviceAndProfilePredicateAggregateToQuery(tc.aggregate, tc.offset)

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
	deep.MaxDepth = 50
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

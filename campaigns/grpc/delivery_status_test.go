package campaigns_grpc

import (
	"reflect"
	"testing"

	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/campaigns/db"
)

func TestDeliveryStatus(t *testing.T) {
	tcases := []struct {
		desc string
		exp  campaignspb.ScheduledDeliveryStatus_Enum
		in   []db.ScheduledDeliveryStatus
	}{
		{
			desc: "undefined",
			exp:  campaignspb.ScheduledDeliveryStatus_UNKNOWN,
			in:   nil,
		},
		{
			desc: "all queued",
			exp:  campaignspb.ScheduledDeliveryStatus_SCHEDULED,
			in: []db.ScheduledDeliveryStatus{
				{State: "queued"},
			},
		},
		{
			desc: "some inprogress",
			exp:  campaignspb.ScheduledDeliveryStatus_INPROGRESS,
			in: []db.ScheduledDeliveryStatus{
				{State: "queued"}, {State: "inprogress"},
			},
		},
		{
			desc: "all states",
			exp:  campaignspb.ScheduledDeliveryStatus_INPROGRESS,
			in: []db.ScheduledDeliveryStatus{
				{State: "queued"}, {State: "inprogress"}, {State: "cancelled"},
			},
		},
		{
			desc: "queued + completed",
			exp:  campaignspb.ScheduledDeliveryStatus_INPROGRESS,
			in: []db.ScheduledDeliveryStatus{
				{State: "queued"}, {State: "completed"},
			},
		},
		{
			desc: "inprogress + completed",
			exp:  campaignspb.ScheduledDeliveryStatus_INPROGRESS,
			in: []db.ScheduledDeliveryStatus{
				{State: "inprogress"}, {State: "completed"},
			},
		},
		{
			desc: "completed",
			exp:  campaignspb.ScheduledDeliveryStatus_FINISHED,
			in: []db.ScheduledDeliveryStatus{
				{State: "cancelled"}, {State: "completed"}, {State: "failed"},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp = tc.exp
				got = InferDeliveryStatus(tc.in)
			)

			if !reflect.DeepEqual(exp, got) {
				t.Errorf("\nExp: %v\nGot: %v", exp, got)
			}
		})
	}
}

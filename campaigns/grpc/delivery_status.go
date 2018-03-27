package campaigns_grpc

import (
	"github.com/pkg/errors"
	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/campaigns/db"
)

func InferDeliveryStatus(dsx []db.ScheduledDeliveryStatus) campaignspb.ScheduledDeliveryStatus_Enum {
	const (
		inprogress = campaignspb.ScheduledDeliveryStatus_INPROGRESS
		scheduled  = campaignspb.ScheduledDeliveryStatus_SCHEDULED
		finished   = campaignspb.ScheduledDeliveryStatus_FINISHED
	)

	var (
		stats = make(map[campaignspb.ScheduledDeliveryStatus_Enum]int)
	)

	if len(dsx) == 0 {
		// TODO: should this be SCHEDULED?
		return campaignspb.ScheduledDeliveryStatus_UNKNOWN
	}

	for _, ds := range dsx {
		var state campaignspb.ScheduledDeliveryStatus_Enum

		// TODO: use constants instead of strings
		switch ds.State {
		case "queued":
			state = scheduled
		case "inprogress":
			state = inprogress
		case "failed", "cancelled", "completed":
			state = finished
		default:
			panic(errors.Errorf("DeliveryStatus: unknown: %q", ds.State))
		}

		stats[state] += 1
	}

	if stats[inprogress] > 0 {
		return inprogress
	} else if stats[finished] > 0 {
		if stats[scheduled] == 0 {
			return finished
		}
		return inprogress
	}

	return scheduled
}

func DeliveryStatusByCampaignId(csx []db.ScheduledDeliveryStatus) map[int32]campaignspb.ScheduledDeliveryStatus_Enum {
	var (
		deliveryStatusByCampaignId = make(map[int32]campaignspb.ScheduledDeliveryStatus_Enum)
		dsByCampaignId             = make(map[int32][]db.ScheduledDeliveryStatus)
	)

	for _, cs := range csx {
		dsByCampaignId[int32(cs.CampaignId)] = append(dsByCampaignId[int32(cs.CampaignId)], cs)
	}

	for id, dsx := range dsByCampaignId {
		deliveryStatusByCampaignId[id] = InferDeliveryStatus(dsx)
	}

	return deliveryStatusByCampaignId
}

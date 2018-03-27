package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/namsral/flag"

	"github.com/golang/protobuf/jsonpb"
	"github.com/golang/protobuf/proto"
	"google.golang.org/grpc"

	. "github.com/roverplatform/rover/apis/go/auth/v1"
	. "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

var (
	//
	// Campaigns
	//
	campaignsServiceUrl = flag.String("campaigns-service-url", "campaigns-service:5100", "campaigns service url address")

	// Action
	cmd = flag.String("cmd", "", "create|publish|unpublish")
	arg = flag.Int("arg", 0, "create|publish|unpublish")
)

var (
	stderr = log.New(os.Stderr, "", 0)
	stdout = log.New(os.Stdout, "", 0)
)

func main() {
	flag.Parse()

	var ctx, cancelFn = context.WithCancel(context.Background())
	defer cancelFn()

	cc, err := grpc.Dial(*campaignsServiceUrl, grpc.WithInsecure())
	if err != nil {
		stderr.Fatalln("grpc.Dial:", err)
	}

	campaignsClient := NewCampaignsClient(cc)

	var (
		m jsonpb.Marshaler

		authCtx = &AuthContext{
			AccountId:        1,
			PermissionScopes: nil,
			UserId:           0,
		}

		pp = func(msg proto.Message, err error) {
			if err != nil {
				stderr.Fatalln("Error:", err)
			}
			if str, err := m.MarshalToString(msg); err != nil {
				stderr.Fatalln("jsonpb.Marshall:", err)
			} else {
				stdout.Println("Response:\n", string(str))
			}
		}
	)

	switch *cmd {
	default:
		stderr.Println("Unknown CMD:", *cmd)
	case "create":
		resp, err := campaignsClient.Create(ctx, &CreateRequest{
			AuthContext:  authCtx,
			CampaignType: CampaignType_SCHEDULED_NOTIFICATION,
			Name:         "a campaign",
		})
		if err != nil {
			stderr.Fatalln("client.Create:", err)
		}

		pp(resp, err)

	case "reschedule":
		var (
			ts, err = timestamp.TimestampProto(time.Now().Add(time.Minute * 5))
		)

		if err != nil {
			stderr.Fatalf("Timestamp: %v", err)
		}

		resp, err := campaignsClient.UpdateScheduledDeliverySettings(ctx, &UpdateScheduledDeliverySettingsRequest{
			AuthContext: authCtx,
			CampaignId:  int32(*arg),
			// ScheduledTimeZone: ""
			ScheduledType:      ScheduledType_SCHEDULED,
			ScheduledTimestamp: ts,
		})

		pp(resp, err)

	case "publish":
		resp, err := campaignsClient.Publish(ctx, &PublishRequest{
			AuthContext: authCtx,
			CampaignId:  int32(*arg),
		})
		if err != nil {
			stderr.Fatalln("client.Publish:", err)
		}

		pp(resp, err)

		// case "cancel":
		// 	resp, err := campaignsClient.Unpublish(ctx, &UnpublishRequest{
		// 		AuthContext: authCtx,
		// 		CampaignId:  int32(*arg),
		// 	})
		// 	if err != nil {
		// 		stderr.Fatalln("client.Unpublish:", err)
		// 	}
		//
		// 	pp(resp, err)
	}
}

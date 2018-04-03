package middleware

import (
	"net"
	"testing"

	"context"

	"time"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
	"google.golang.org/grpc"
)

type simple struct {
	audience.AudienceServer

	callCount map[string]int
}

func (c *simple) GetDevice(context.Context, *audience.GetDeviceRequest) (*audience.GetDeviceResponse, error) {
	c.callCount["GetDevice"]++

	return &audience.GetDeviceResponse{
		Device: &audience.Device{
			DeviceId:          "abc",
			ProfileIdentifier: "expo",
		},
	}, nil
}

func (s *simple) UpdateDeviceLocation(context.Context, *audience.UpdateDeviceLocationRequest) (*audience.UpdateDeviceLocationResponse, error) {
	s.callCount["UpdateDeviceLocation"]++
	return &audience.UpdateDeviceLocationResponse{}, nil
}

func (s *simple) GetProfile(ctx context.Context, response *audience.GetProfileRequest) (*audience.GetProfileResponse, error) {
	s.callCount["GetProfile"]++
	return &audience.GetProfileResponse{
		Profile: &audience.Profile{
			Identifier: "expo",
		},
	}, nil
}

func (c *simple) Reset() {
	c.callCount = map[string]int{}
}

func TestMiddleware(t *testing.T) {

	TimeNow = func() *timestamp.Timestamp {
		tstamp, _ := time.Parse(time.RFC3339, "2018-03-22T20:09:10Z")
		now, _ := timestamp.TimestampProto(tstamp)
		return now
	}

	var (
		ctx     = context.Background()
		authctx = &auth.AuthContext{AccountId: 1}
		server  = &simple{
			callCount: make(map[string]int),
		}
		addr = ":7783"
	)

	lis, err := net.Listen("tcp", addr)
	if err != nil {
		t.Fatal(err)
	}

	grpcServer := grpc.NewServer()

	go grpcServer.Serve(lis)
	defer grpcServer.Stop()

	audience.RegisterAudienceServer(grpcServer, server)

	// now we have a real client connect to our fake server
	conn, err := grpc.Dial(addr, grpc.WithInsecure(), grpc.WithUnaryInterceptor(NewAudienceClientMiddleware(NewCache(100), 10*time.Millisecond)))
	if err != nil {
		t.Fatal(err)
	}

	client := audience.NewAudienceClient(conn)

	// Caches device after first find
	client.GetDevice(ctx, &audience.GetDeviceRequest{
		AuthContext: authctx,
		DeviceId:    "abc",
	})

	client.GetDevice(ctx, &audience.GetDeviceRequest{
		AuthContext: authctx,
		DeviceId:    "abc",
	})

	if server.callCount["GetDevice"] != 1 {
		t.Fatalf("GetDevice was expected to be called 1 times but was called: %d", server.callCount["GetDevice"])
	}

	// updates cache item with new location properties
	client.UpdateDeviceLocation(ctx, &audience.UpdateDeviceLocationRequest{
		AuthContext: authctx,
		DeviceId:    "abc",

		LocationLatitude:  44.22919,
		LocationLongitude: -79.18281,
		LocationAccuracy:  500,
		LocationCountry:   "Canada",
		LocationState:     "Ontario",
		LocationCity:      "Toronto",
	})

	got, err := client.GetDevice(ctx, &audience.GetDeviceRequest{
		AuthContext: authctx,
		DeviceId:    "abc",
	})

	if server.callCount["GetDevice"] != 1 {
		t.Error("GetDevice was expecting a cache return after updating location but instead called server")
	}

	var exp = &audience.Device{
		DeviceId:          "abc",
		ProfileIdentifier: "expo",

		LocationLatitude:  44.22919,
		LocationLongitude: -79.18281,
		LocationAccuracy:  500,
		LocationCountry:   "Canada",
		LocationState:     "Ontario",
		LocationCity:      "Toronto",

		UpdatedAt: TimeNow(),
	}

	if diff := rtesting.Diff(exp, got.GetDevice(), nil, nil); diff != nil {
		t.Fatalf("\nDiff:\n%s", rtesting.Difff(diff))
	}

	client.GetProfile(ctx, &audience.GetProfileRequest{
		AuthContext: authctx,
		Identifier:  "expo",
	})

	if server.callCount["GetProfile"] != 1 {
		t.Fatalf("GetProfile expected to be called once but was called %d", server.callCount["GetProfile"])
	}

	// This call happens less than 10 milliseconds apart
	client.GetProfile(ctx, &audience.GetProfileRequest{
		AuthContext: authctx,
		Identifier:  "expo",
	})

	if server.callCount["GetProfile"] != 1 {
		t.Fatalf("GetProfile expected to be a successful cache hit but was called %d", server.callCount["GetProfile"])
	}

	// force a sleep so the profile call will expire the cache entry
	time.Sleep(50 * time.Millisecond)
	client.GetProfile(ctx, &audience.GetProfileRequest{
		AuthContext: authctx,
		Identifier:  "expo",
	})

	if server.callCount["GetProfile"] != 2 {
		t.Fatalf("GetProfile expected to be called due to cache expiry but was only called %d", server.callCount["GetProfile"])
	}

}

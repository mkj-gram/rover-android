// +build integration

package service_test

import (
	"context"
	"testing"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

func BenchmarkService(b *testing.B) {
	var (
		db               = mongodb.New(dialMongo(b, *tMongoDSN))
		svc              = service.New(db, logNotifier(b))
		client, teardown = NewSeviceClient(b, "localhost:51000", svc)

		ctx = context.Background()

		req = &audience.GetDeviceRequest{
			AuthContext: &auth.AuthContext{AccountId: 1},
			DeviceId:    "adevice00",
		}
	)

	defer teardown()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		_, err := client.GetDevice(ctx, req)
		if err != nil {
			b.Fatal(err)
		}
	}
}

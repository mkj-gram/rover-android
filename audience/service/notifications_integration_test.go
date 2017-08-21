// +build integration

package service_test

import (
	"golang.org/x/net/context"
	"sync"
	"testing"

	"github.com/roverplatform/rover/audience/service"
)

var (
	notifications struct {
		sync.RWMutex
		msgs []service.Message
	}
)

func logNotifier(t testing.TB) service.Notifier {
	return service.FuncNotifier(func(ctx context.Context, msg service.Message) error {
		notifications.Lock()
		defer notifications.Unlock()
		notifications.msgs = append(notifications.msgs, msg)
		return nil
	})
}

func testAudienceServiceNotifications(t *testing.T) {
	notifications.RLock()
	defer notifications.RUnlock()

	var exp = []service.Message{
		{"account_id": "1", "event": "created", "model": "profile", "id": "0194fdc2fa2ffcc041d3ff12"},
		{"account_id": "1", "event": "deleted", "model": "profile", "id": "0194fdc2fa2ffcc041d3ff12"},
		{"account_id": "5", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaaaa"},
		{"account_id": "5", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaa00"},
		{"account_id": "5", "event": "updated", "model": "profileSchema", "profile_id": "aaaaaaaaaaaaaaaaaaaaaa00"},
		{"account_id": "5", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaa01"},
		{"account_id": "5", "event": "updated", "model": "profileSchema", "profile_id": "aaaaaaaaaaaaaaaaaaaaaa01"},
		{"account_id": "6", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaaff"},
		{"account_id": "6", "event": "updated", "model": "profileSchema", "profile_id": "aaaaaaaaaaaaaaaaaaaaaaff"},
		{"account_id": "20", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaa20"},
		{"account_id": "20", "event": "updated", "model": "profileSchema", "profile_id": "aaaaaaaaaaaaaaaaaaaaaa20"},
		{"account_id": "20", "event": "updated", "model": "profile", "id": "aaaaaaaaaaaaaaaaaaaaaa20"},
		{"account_id": "5", "event": "updated", "model": "profile", "id": "000000000000000000000aa0"},
		{"account_id": "1", "event": "created", "model": "device", "profile_id": "dddddddddddddddddddddddd", "device_id": "DDDDDDDD-0000-0000-0000-000000000001"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad1", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad1", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad3", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad3", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad3", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad3", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000bbb", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-000000000000"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad4", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD4"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad5", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD5"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad6", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD6"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad6", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7"},
		{"account_id": "5", "event": "updated", "model": "device", "profile_id": "000000000000000000000ad6", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7"},
		{"account_id": "5", "event": "deleted", "model": "device", "profile_id": "000000000000000000000add", "device_id": "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD"},

		{"event": "SetDeviceProfile",
			"account_id":     "1",
			"model":          "device",
			"profile_id":     "000000000000000000000aa1",
			"old_profile_id": "000000000000000000000aa2",
			"device_id":      "D00000000000000000000000",
		},
	}

	if diff := Diff(notifications.msgs, exp, nil, nil); diff != nil {
		t.Errorf("Diff:\n%v", difff(diff))
	}
}

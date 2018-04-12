package scylla_test

import (
	"context"
	"testing"

	"github.com/roverplatform/rover/notification/scylla"

	rtesting "github.com/roverplatform/rover/go/testing"
)

// we first want to migrate

func TestNotificationSettingsStore(t *testing.T) {
	config, keyspace := DefaultClusterConfig(t)

	var reset = func() {
		ResetDB(t, *config, keyspace, "./migrations")
		session := NewTestSession(t, config)
		InsertFixtures(t, session, "./testdata")
	}

	reset()

	t.Run("TestNotificationSettingsStore_OneById", testNotificationSettingsStore_OneById)
}

func testNotificationSettingsStore_OneById(t *testing.T) {
	tests := []struct {
		name string

		campaignId int32

		expect      *scylla.NotificationSettings
		expectError error
	}{
		{
			name: "error: not found",

			campaignId:  -1,
			expectError: scylla.ErrNotFound,
		},

		{
			name:       "returns notification settings",
			campaignId: 1,

			expect: &scylla.NotificationSettings{
				CampaignId: 1,
				AccountID:  1,

				Attributes: map[string]string{
					"hello": "123",
				},
			},
		},
	}

	var (
		config, _ = DefaultClusterConfig(t)
		session   = NewTestSession(t, config)
		db        = scylla.NewFromSession(session)
	)

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				exp, expErr = test.expect, test.expectError
				got, gotErr = db.NotificationSettingsStore().OneById(context.Background(), test.campaignId)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}
		})
	}
}

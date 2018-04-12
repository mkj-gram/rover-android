package scylla_test

import (
	"context"
	"testing"

	"github.com/gocql/gocql"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/notification/scylla"

	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNotificationsStore(t *testing.T) {
	config, keyspace := DefaultClusterConfig(t)

	var reset = func() {
		ResetDB(t, *config, keyspace, "./migrations")
		session := NewTestSession(t, config)
		InsertFixtures(t, session, "./testdata")
	}

	reset()

	t.Run("Notifications_OneById", test_NotificationsStore_OneById)
	t.Run("Notifications_Create", test_NotificationsStore_Create)
}

func uuid(t *testing.T, str string) scylla.UUID {
	t.Helper()

	id, err := gocql.ParseUUID(str)
	if err != nil {
		t.Fatal(err)
	}

	return id
}

func test_NotificationsStore_OneById(t *testing.T) {
	type given struct {
		AccountId      int32
		DeviceId       string
		NotificationId string
	}

	tests := []struct {
		desc string

		given given
		exp   *scylla.Notification

		expErr error
	}{
		{
			desc: "error: not found",
			given: given{
				AccountId:      1,
				DeviceId:       "1",
				NotificationId: "40400000-3dcd-11e8-b467-0ed5f89f718b",
			},
			expErr: scylla.ErrNotFound,
		},

		{
			desc: "returns a notification",

			given: given{
				AccountId:      1,
				DeviceId:       "d1",
				NotificationId: "689f9586-3dcd-11e8-b467-0ed5f89f718b",
			},

			exp: &scylla.Notification{
				Id:         uuid(t, "689f9586-3dcd-11e8-b467-0ed5f89f718b"),
				AccountId:  1,
				CampaignId: 1,
				DeviceId:   "d1",
				Title:      "title1",
				Body:       "body1",
				IsRead:     true,
				IsDeleted:  true,
			},
		},
	}

	var (
		config, _ = DefaultClusterConfig(t)
		session   = NewTestSession(t, config)
		db        = scylla.NewFromSession(session)
	)

	for _, test := range tests {
		t.Run(test.desc, func(t *testing.T) {
			var (
				exp, expErr = test.exp, test.expErr
				got, gotErr = db.NotificationsStore().OneById(context.Background(), test.given.AccountId, test.given.DeviceId, test.given.NotificationId)
			)

			if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}
		})
	}
}

func test_NotificationsStore_Create(t *testing.T) {
	tests := []struct {
		desc string

		given  *scylla.Notification
		expErr error

		after *scylla.Notification
	}{
		{
			desc: "error: invalid",

			given: &scylla.Notification{},

			expErr: errors.Errorf(`validations: account_id: is required. campaign_id: is required. device_id: is required. title: is required. body: is required.`),
		},

		{
			desc: "creates a notification",
			given: &scylla.Notification{
				// Id:          "aaaaaaaa-3dcd-11e8-b467-0ed5f89f718b",
				AccountId:  1,
				CampaignId: 1,
				DeviceId:   "d2",
				Title:      "title2",
				Body:       "body2",
				IsRead:     true,
				IsDeleted:  true,
			},

			after: &scylla.Notification{
				Id:         uuid(t, "f944c7b4-3dcd-11e8-b467-0ed5f89f718b"),
				AccountId:  1,
				CampaignId: 1,
				DeviceId:   "d2",
				Title:      "title2",
				Body:       "body2",
				IsRead:     true,
				IsDeleted:  true,
			},
		},
	}

	var (
		config, _ = DefaultClusterConfig(t)
		session   = NewTestSession(t, config)
		db        = scylla.NewFromSession(session)
		timeUUID  = scylla.TimeUUID
	)

	scylla.TimeUUID = func() scylla.UUID {
		t.Helper()
		id, err := gocql.ParseUUID("f944c7b3-3dcd-11e8-b467-0ed5f89f718b")
		if err != nil {
			t.Fatal(err)
		}
		return id
	}

	// set/restore TimeUUID generator
	defer func() {
		scylla.TimeUUID = timeUUID
	}()

	for _, test := range tests {
		t.Run(test.desc, func(t *testing.T) {
			var (
				expErr = test.expErr
				gotErr = db.NotificationsStore().Create(context.Background(), test.given)
			)

			if diff := rtesting.Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			if test.after != nil {
				var (
					exp, expErr = test.given, (error)(nil)
					got, gotErr = db.NotificationsStore().OneById(context.Background(), test.given.AccountId, test.given.DeviceId, test.given.Id.String())
				)

				if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfterDiff:\n%v", rtesting.Difff(diff))
				}
			}
		})
	}
}

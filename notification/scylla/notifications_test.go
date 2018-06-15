package scylla_test

import (
	"context"
	"testing"

	"github.com/gocql/gocql"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/notification/scylla"

	"fmt"

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
	t.Run("Notifications_Delete", test_NotificationsStore_Delete)
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

			expErr: errors.Errorf(`validations: id: uuid: invalid. account_id: is required. campaign_id: is required. device_id: is required. body: is required.`),
		},

		{
			desc: "creates a notification",
			given: &scylla.Notification{
				Id:         uuid(t, "f944c7b4-3dcd-11e8-b467-0ed5f89f718b"),
				AccountId:  1,
				CampaignId: 1,
				DeviceId:   "d2",
				Title:      "title2",
				Body:       "body2",
				IsRead:     true,
				IsDeleted:  true,
				IsTest:     true,
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
				IsTest:     true,
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
				expErr = test.expErr
				gotErr = db.NotificationsStore().Create(context.Background(), test.given)
			)

			if diff := rtesting.Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			if test.after != nil {
				var (
					exp, expErr = test.after, (error)(nil)
					got, gotErr = db.NotificationsStore().OneById(context.Background(), test.given.AccountId, test.given.DeviceId, test.given.Id.String())
				)

				if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfterDiff:\n%v", rtesting.Difff(diff))
				}
			}
		})
	}
}

func test_NotificationsStore_Delete(t *testing.T) {

	// Define what data we expect in the DB
	ClearDBWithFixtures(t, "./testdata/testNotificationsStore_Delete.cql")

	type input struct {
		AccountID      int32
		DeviceID       string
		NotificationID string
	}

	tests := []struct {
		desc   string
		input  input
		expect error

		after error
	}{
		{
			desc: "error: not found",
			input: input{
				AccountID:      1,
				DeviceID:       "ABC123",
				NotificationID: "0e090990-4caa-11e8-842f-0ed5f89f718b",
			},

			expect: errors.Wrap(scylla.ErrNotFound, "OneById"),
		},

		{
			desc: "deletes notification",
			input: input{
				AccountID:      1,
				DeviceID:       "ABC123",
				NotificationID: "9d1b7d36-4cd5-11e8-842f-0ed5f89f718b",
			},

			expect: nil,
			after:  scylla.ErrNotFound,
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
				expErr = test.expect
				gotErr = db.NotificationsStore().Delete(context.Background(), test.input.AccountID, test.input.DeviceID, test.input.NotificationID)
			)

			fmt.Println(expErr, gotErr)
			if diff := rtesting.Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			if test.after != nil {
				var (
					expErr      = test.after
					got, gotErr = db.NotificationsStore().OneById(context.Background(), test.input.AccountID, test.input.DeviceID, test.input.NotificationID)
				)

				if diff := rtesting.Diff(nil, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfterDiff:\n%v", rtesting.Difff(diff))
				}
			}
		})
	}
}

func test_NotificationsStore_SetReadStatus(t *testing.T) {

	ClearDBWithFixtures(t, "./testdata/testNotificationsStore_SetReadStatus.cql")

	type input struct {
		AccountID      int32
		DeviceID       string
		NotificationID string
		isRead         bool
	}

	tests := []struct {
		desc string

		input  input
		expErr error

		after *scylla.Notification
	}{
		{
			desc: "error: not found",

			input: input{
				AccountID:      0,
				DeviceID:       "kamakieje",
				NotificationID: "jjjjjjsksksks",
				isRead:         true,
			},

			expErr: scylla.ErrNotFound,
		},

		{
			desc: "sets read status",
			input: input{
				AccountID:      1,
				DeviceID:       "ABC123",
				NotificationID: "f944c7b4-3dcd-11e8-b467-0ed5f89f718b",
				isRead:         true,
			},

			after: &scylla.Notification{
				Id:         uuid(t, "f944c7b4-3dcd-11e8-b467-0ed5f89f718b"),
				AccountId:  1,
				CampaignId: 1,
				DeviceId:   "ABC123",
				Title:      "title",
				Body:       "body",
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
				expErr = test.expErr
				gotErr = db.NotificationsStore().SetReadStatus(
					context.Background(),
					test.input.AccountID,
					test.input.DeviceID,
					test.input.NotificationID,
					test.input.isRead)
			)

			if diff := rtesting.Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			if test.after != nil {
				var (
					exp, expErr = test.after, (error)(nil)
					got, gotErr = db.NotificationsStore().OneById(context.Background(), test.input.AccountID, test.input.DeviceID, test.input.NotificationID)
				)

				if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nAfterDiff:\n%v", rtesting.Difff(diff))
				}
			}
		})
	}
}

package scylla_test

import (
	"context"
	"testing"

	"github.com/roverplatform/rover/notification/scylla"

	rtesting "github.com/roverplatform/rover/go/testing"
)

func TestNotificationSettingsStore(t *testing.T) {
	config, keyspace := DefaultClusterConfig(t)

	// reset & setup the db by clearing everything and then applying all migrations
	ResetDB(t, *config, keyspace, "./migrations")

	t.Run("TestNotificationSettingsStore_OneById", testNotificationSettingsStore_OneById)
	t.Run("TestNotificationSettingsStore_Create", testNotificationSettingsStore_Create)
}

func testNotificationSettingsStore_OneById(t *testing.T) {

	// Define what data we expect in the DB
	ClearDBWithFixtures(t, "./testdata/testNotificationSettingsStore_OneById.cql")

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

		{
			name:       "preserves string enums",
			campaignId: 2,
			expect: &scylla.NotificationSettings{
				CampaignId: 2,
				AccountID:  1,

				AttachmentType:              scylla.AttachmentType_AUDIO,
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_IN_BROWSER,
			},
		},
	}

	var (
		config, _ = DefaultClusterConfig(t)
		session   = NewTestSession(t, config)
		db        = scylla.NewFromSession(session)
	)

	defer session.Close()

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

func testNotificationSettingsStore_Create(t *testing.T) {

	// Make sure we are running this test with nothing in the db
	ClearDB(t)

	type expect struct {
		campaignID int32
		exp        *scylla.NotificationSettings
		expErr     error
	}

	tests := []struct {
		name string

		req    scylla.NotificationSettings
		expErr error

		after *expect
	}{
		{
			name: "validation error: unsupported AttachmentType",
			req: scylla.NotificationSettings{
				AttachmentType: scylla.AttachmentType("hi"),
			},
			expErr: scylla.NewValidationError("unsupported attachment_type got: hi"),
		},

		{
			name: "validation error: unsupported TapBehaviorType",
			req: scylla.NotificationSettings{
				TapBehaviorType: scylla.TapBehaviorType("test"),
			},
			expErr: scylla.NewValidationError("unsupported tap_behavior_type got: test"),
		},

		{
			name: "validation error: unsupported TapBehaviorPresentationType",
			req: scylla.NotificationSettings{
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_APP,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType("another"),
			},
			expErr: scylla.NewValidationError("unsupported tap_behavior_presentation_type got: another"),
		},

		{
			name: "validation error: empty experience_id",

			req: scylla.NotificationSettings{
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
				ExperienceId:                "",
			},
			expErr: scylla.NewValidationError("experience id must be present when tap_behavior_type is open experience"),
		},

		{
			name: "validation error: empty attachment_url",

			req: scylla.NotificationSettings{
				AttachmentType: scylla.AttachmentType_VIDEO,
				AttachmentUrl:  "",

				TapBehaviorType:             scylla.TapBehaviorType_OPEN_APP,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
			},
			expErr: scylla.NewValidationError("attachment_url must be present when attachment_type is set"),
		},

		{
			name: "validation error: empty tap_behavior_url",
			req: scylla.NotificationSettings{
				AttachmentType:              scylla.AttachmentType_NONE,
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_WEBSITE,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
				TapBehaviorUrl:              "",
			},
			expErr: scylla.NewValidationError("tap_behavior_url  must be present when tap_behavior_type is open website or open deeplink"),
		},

		{
			name: "validation error: empty tap_behavior_presentation_type",
			req: scylla.NotificationSettings{
				AttachmentType:              scylla.AttachmentType_NONE,
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_WEBSITE,
				TapBehaviorUrl:              "Hello",
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
			},
			expErr: scylla.NewValidationError("tap_behavior_presentation_type must be present when tap_behavior_type is open website"),
		},

		{
			name: "saves settings to db",
			req: scylla.NotificationSettings{
				CampaignId:                  44,
				AccountID:                   33,
				ExperienceId:                "abc123",
				AttachmentUrl:               "https://google.ca/cat.png",
				AttachmentType:              scylla.AttachmentType_IMAGE,
				TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
				TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
				IosContentAvailable:         true,
				IosMutableContent:           true,
				IosSound:                    "sound-file.wav",
				IosCategoryIdentifier:       "category",
				IosThreadIdentifier:         "thread",
				AndroidChannelId:            "channel-id",
				AndroidSound:                "sound-file.android",
				AndroidTag:                  "android-tag",
				Expiration:                  99,
				Attributes: map[string]string{
					"value1": "something",
					"value2": "another",
				},
				AlertOptionPushNotification:   true,
				AlertOptionNotificationCenter: false,
				AlertOptionBadgeNumber:        true,
			},

			after: &expect{
				campaignID: 44,
				exp: &scylla.NotificationSettings{
					CampaignId:                  44,
					AccountID:                   33,
					ExperienceId:                "abc123",
					AttachmentUrl:               "https://google.ca/cat.png",
					AttachmentType:              scylla.AttachmentType_IMAGE,
					TapBehaviorType:             scylla.TapBehaviorType_OPEN_EXPERIENCE,
					TapBehaviorPresentationType: scylla.TapBehaviorPresentationType_UNKNOWN,
					IosContentAvailable:         true,
					IosMutableContent:           true,
					IosSound:                    "sound-file.wav",
					IosCategoryIdentifier:       "category",
					IosThreadIdentifier:         "thread",
					AndroidChannelId:            "channel-id",
					AndroidSound:                "sound-file.android",
					AndroidTag:                  "android-tag",
					Expiration:                  99,
					Attributes: map[string]string{
						"value1": "something",
						"value2": "another",
					},
					AlertOptionPushNotification:   true,
					AlertOptionNotificationCenter: false,
					AlertOptionBadgeNumber:        true,
				},
			},
		},
	}

	var (
		config, _ = DefaultClusterConfig(t)
		session   = NewTestSession(t, config)
		db        = scylla.NewFromSession(session)
	)

	defer session.Close()

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var (
				expErr = test.expErr
				gotErr = db.NotificationSettingsStore().Create(context.Background(), test.req)
			)

			if diff := rtesting.Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
			}

			if test.after != nil {
				var (
					exp, expErr = test.after.exp, test.after.expErr
					got, gotErr = db.NotificationSettingsStore().OneById(context.Background(), test.after.campaignID)
				)

				if diff := rtesting.Diff(exp, got, expErr, gotErr); diff != nil {
					t.Fatalf("\nDiff:\n%v", rtesting.Difff(diff))
				}
			}

		})
	}

}

package service

import (
	"strconv"

	"golang.org/x/net/context"
)

type (
	Notifier interface {
		Notify(ctx context.Context, msg Message) error
	}

	// Message is a Notifier message
	Message map[string]string

	// FuncNotifier implements Notifier
	FuncNotifier func(ctx context.Context, msg Message) error

	// serviceNotifier is uses Notifier to notify about data updates
	serviceNotify struct {
		Notifier
	}
)

// Notify implements Notifier interface for FuncNotifier type
func (fn FuncNotifier) Notify(ctx context.Context, msg Message) error {
	return fn(ctx, msg)
}

//
// Notifier
//
func (n *serviceNotify) profileCreated(ctx context.Context, acctId int32, id string) {
	n.Notify(ctx, Message{
		"event":      "created",
		"model":      "profile",
		"id":         id,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) profileDeleted(ctx context.Context, acctId int32, id string, identifier string) {
	n.Notify(ctx, Message{
		"event":      "deleted",
		"model":      "profile",
		"id":         id,
		"identifier": identifier,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) profileUpdated(ctx context.Context, acctId int32, id string) {
	m := Message{
		"event":      "updated",
		"model":      "profile",
		"id":         id,
		"account_id": strconv.Itoa(int(acctId)),
	}

	n.Notify(ctx, m)
}

func (n *serviceNotify) deviceCreated(ctx context.Context, acctId int32, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":     "created",
		"model":     "device",
		"device_id": deviceId,
		// profile_id is used to specify parent document in ES
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceDeleted(ctx context.Context, acctId int32, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":     "deleted",
		"model":     "device",
		"device_id": deviceId,
		// profile_id is used to specify parent document in ES
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceUpdated(ctx context.Context, acctId int32, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":     "updated",
		"model":     "device",
		"device_id": deviceId,
		// profile_id is used to specify parent document in ES
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceProfileUpdated(ctx context.Context, acctId int32, oldProfileId, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":          "SetDeviceProfile",
		"model":          "device",
		"old_profile_id": oldProfileId,
		// profile_id is used to specify parent document in ES
		"profile_id": profileId,
		"device_id":  deviceId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceProfileIdentifierUpdated(ctx context.Context, acctId int32, oldPId, newPId, deviceId string) {
	n.Notify(ctx, Message{
		"event":                  "SetDeviceProfileIdentifier",
		"model":                  "device",
		"old_profile_identifier": oldPId,
		// profile_id is used to specify parent document in ES
		"profile_identifier": newPId,
		"device_id":          deviceId,
		"account_id":         strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) profileSchemaUpdated(ctx context.Context, acctId int32) {
	m := Message{
		"event":      "updated",
		"model":      "profileSchema",
		"account_id": strconv.Itoa(int(acctId)),
	}

	n.Notify(ctx, m)
}

func (n *serviceNotify) deviceSchemaUpdated(ctx context.Context, acctId int32) {
	m := Message{
		"event":      "updated",
		"model":      "deviceSchema",
		"account_id": strconv.Itoa(int(acctId)),
	}

	n.Notify(ctx, m)
}

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

func (n *serviceNotify) profileDeleted(ctx context.Context, acctId int32, id string) {
	n.Notify(ctx, Message{
		"event":      "deleted",
		"model":      "profile",
		"id":         id,
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
		"event":      "created",
		"model":      "device",
		"device_id":  deviceId,
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceDeleted(ctx context.Context, acctId int32, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":      "deleted",
		"model":      "device",
		"device_id":  deviceId,
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceUpdated(ctx context.Context, acctId int32, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":      "updated",
		"model":      "device",
		"device_id":  deviceId,
		"profile_id": profileId,
		"account_id": strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) deviceProfileUpdated(ctx context.Context, acctId int32, oldProfileId, profileId, deviceId string) {
	n.Notify(ctx, Message{
		"event":          "SetDeviceProfile",
		"model":          "device",
		"old_profile_id": oldProfileId,
		"profile_id":     profileId,
		"device_id":      deviceId,
		"account_id":     strconv.Itoa(int(acctId)),
	})
}

func (n *serviceNotify) schemaUpdated(ctx context.Context, acctId int32, id string) {
	m := Message{
		"event":      "updated",
		"model":      "profileSchema",
		"profile_id": id,
		"account_id": strconv.Itoa(int(acctId)),
	}

	n.Notify(ctx, m)
}

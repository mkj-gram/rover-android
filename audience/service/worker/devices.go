package worker

import (
	"strconv"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"golang.org/x/net/context"
	"gopkg.in/mgo.v2/bson"
)

func (h *Worker) deviceIds(msgs []service.Message) []string {
	var ids = make([]string, len(msgs))
	for i := range msgs {
		ids[i] = msgs[i]["device_id"]
	}
	return ids
}

func (h *Worker) handleDevicesUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	devices, err := h.findDevicesByIds(h.deviceIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "FindDevicesByIds")
	}

	ops := make([]*elastic.BulkOp, len(devices))

	for i := range devices {
		d := &devices[i]
		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpIndex,
			DocumentType: "device",
			Document:     elastic.DeviceDoc(d),
			Id:           d.DeviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(int(d.AccountId))),
			ParentId:     d.ProfileId.Hex(),
		}
	}

	return ops, nil
}

func (h *Worker) handleDevicesDeleted(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	ops := make([]*elastic.BulkOp, len(msgs))

	for i, msg := range msgs {
		var (
			deviceId  = msg["device_id"]
			accountId = msg["account_id"]
			profileId = msg["profile_id"]
		)

		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpDelete,
			DocumentType: "device",
			Document:     nil,
			Id:           deviceId,
			IndexName:    h.AccountIndex(accountId),
			ParentId:     profileId,
		}
	}

	return ops, nil
}

// Message{
// 		"account_id":     "1",
// 		"event":          "SetDeviceProfile",
// 		"model":          "device",
// 		"old_profile_id": oldProfileId,
// 		"profile_id":			newProfileId,
// 		"device_id":      deviceId,
// 	}

func (h *Worker) handleDevicesSetDeviceProfile(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	var (
		deviceIds = make([]string, len(msgs))
		ops       = make([]*elastic.BulkOp, 0, len(msgs))
	)

	for i, msg := range msgs {
		var (
			deviceId     = msg["device_id"]
			accountId    = msg["account_id"]
			oldProfileId = msg["old_profile_id"]
		)

		deviceIds[i] = deviceId

		op := &elastic.BulkOp{
			OpName:       elastic.BulkOpDelete,
			DocumentType: "device",
			Document:     nil,
			Id:           deviceId,
			IndexName:    h.AccountIndex(accountId),
			ParentId:     oldProfileId,
		}

		ops = append(ops, op)
	}

	// delete from old profiles
	devices, err := h.findDevicesByIds(deviceIds)
	if err != nil {
		return nil, errors.Wrap(err, "FindDevicesByIds")
	}

	for i := range devices {
		var d = &devices[i]

		op := &elastic.BulkOp{
			OpName:       elastic.BulkOpIndex,
			DocumentType: "device",
			Document:     elastic.DeviceDoc(d),
			Id:           d.DeviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(int(d.AccountId))),
			ParentId:     d.ProfileId.Hex(),
		}

		ops = append(ops, op)
	}

	return ops, nil
}

func (h *Worker) findDevicesByIds(deviceIds []string) ([]mongodb.Device, error) {
	var (
		devices []mongodb.Device

		Q = bson.M{"device_id": bson.M{"$in": deviceIds}}

		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("devices").Find(Q).All(&devices)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	return devices, nil
}

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

func deviceIds(msgs []service.Message) []string {
	var ids = make([]string, len(msgs))
	for i := range msgs {
		ids[i] = msgs[i]["device_id"]
	}
	return ids
}

func (h *Worker) accountProfileIdentifiers(msgs []service.Message) []aid {
	var apids = make([]aid, len(msgs))
	for i := range msgs {
		var acctId int
		if id, err := strconv.Atoi(msgs[i]["account_id"]); err != nil {
			h.Log.Errorf("accountProfileIdentifiers: strconv.Atoi: %v", err)
			continue
		} else {
			acctId = id
		}

		apids[i] = aid{
			AccountId: acctId,
			Id:        msgs[i]["profile_identifier"],
		}
	}

	return apids
}

func (h *Worker) handleDevicesUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	// TODO: fetch considering account_id
	var devices, err = h.findDevicesByIds(deviceIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "FindDevicesByIds")
	}

	var deviceMap = make(map[aid]*mongodb.Device)
	for i := range devices {
		var key = aid{int(devices[i].AccountId), devices[i].DeviceId}
		deviceMap[key] = &devices[i]
	}

	// fetching profiles requires {account_id, profile_identifier} tuples
	var aids = make([]aid, 0, len(devices))
	for i := range devices {
		// skip anonymous profiles
		if devices[i].ProfileIdentifier == "" {
			continue
		}
		aids = append(aids, aid{
			AccountId: int(devices[i].AccountId),
			Id:        devices[i].ProfileIdentifier,
		})
	}

	var profiles []mongodb.Profile
	profiles, err = h.findProfilesByIdentifiers(aids)
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesByIdentifiers")
	}

	var profileMap = make(map[aid]*mongodb.Profile)
	for i := range profiles {
		var key = aid{int(profiles[i].AccountId), profiles[i].Identifier}
		profileMap[key] = &profiles[i]
	}

	var ops = make([]*elastic.BulkOp, len(devices))
	for i := range devices {
		var (
			d = &devices[i]
			p = profileMap[aid{int(d.AccountId), d.ProfileIdentifier}]
		)
		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpIndex,
			DocumentType: "device",
			Document:     elastic.DeviceDoc(d, p),
			Id:           d.DeviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(int(d.AccountId))),
		}
	}

	return ops, nil
}

func (h *Worker) handleDevicesDeleted(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	var ops = make([]*elastic.BulkOp, len(msgs))

	for i, msg := range msgs {
		var (
			deviceId  = msg["device_id"]
			accountId = msg["account_id"]
		)

		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpDelete,
			DocumentType: "device",
			Document:     nil,
			Id:           deviceId,
			IndexName:    h.AccountIndex(accountId),
		}
	}

	return ops, nil
}

// Message{
// 		"event":                  "SetDeviceProfileIdentifier",
// 		"model":                  "device",
// 		"old_profile_identifier": oldPId,
// 		"profile_identifier":			newPId,
// 		"device_id":							deviceId,
// 		"account_id":							strconv.Itoa(int(acctId)),
// 	}

func (h *Worker) handleDevicesSetDeviceProfileIdentifier(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	var (
		profiles []mongodb.Profile

		err error
	)

	profiles, err = h.findProfilesByIdentifiers(h.accountProfileIdentifiers(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesByIdentifiers")
	}

	var profileMap = make(map[aid]*mongodb.Profile)
	for i := range profiles {
		var key = aid{int(profiles[i].AccountId), profiles[i].Identifier}
		profileMap[key] = &profiles[i]
	}

	var ops = make([]*elastic.BulkOp, 0, len(msgs))

	for i := range msgs {
		var (
			acctId int
			msg    = msgs[i]
		)

		if id, err := strconv.Atoi(msg["account_id"]); err != nil {
			h.Log.Errorf("handleDevicesSetDeviceProfileIdentifiers: strconv.Atoi: %v", err)
			continue
		} else {
			acctId = id
		}

		var (
			deviceId = msg["device_id"]
			pid      = msg["profile_identifier"]

			update = elastic.M{
				"profile_identifier": pid,
			}
		)

		if p, ok := profileMap[aid{acctId, pid}]; ok {
			update["profile"] = elastic.ProfileDoc(p)
		} else {
			update["profile"] = nil
		}

		ops = append(ops, &elastic.BulkOp{
			OpName:       elastic.BulkOpUpdate,
			DocumentType: "device",
			Document:     update,
			Id:           deviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(acctId)),
		})
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

type aid struct {
	AccountId int
	Id        string
}

func (h *Worker) findProfilesByIdentifiers(apids []aid) ([]mongodb.Profile, error) {
	var acctPIDs = make(map[int][]string)
	for i := range apids {
		// do not query anonymous profiles
		if apids[i].Id == "" {
			continue
		}
		acctPIDs[apids[i].AccountId] = append(acctPIDs[apids[i].AccountId], apids[i].Id)
	}

	var conditions []elastic.M
	for acctId, pids := range acctPIDs {
		if len(pids) == 0 {
			continue
		}
		conditions = append(conditions, bson.M{
			"account_id":         acctId,
			"profile_identifier": bson.M{"$in": pids},
		})
	}

	if len(conditions) == 0 {
		return nil, nil
	}

	var (
		profiles []mongodb.Profile

		Q = bson.M{"$or": conditions}

		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("profiles").Find(Q).All(&profiles)
	if err != nil {
		return nil, errors.Wrap(err, "profiles.Find")
	}

	return profiles, nil
}

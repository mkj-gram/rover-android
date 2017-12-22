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

// Handle events where only the device attributes have been updated
func (h *Worker) handleDevicesUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	var (
		deviceIdsByAccount = map[int64][]string{}
		queries            []bson.M
	)

	// Group device ids by their account_id
	for _, msg := range msgs {
		if id, ok := msg["account_id"]; ok {
			accountId, err := strconv.ParseInt(id, 0, 64)
			if err != nil {
				continue
			}

			if deviceId, ok := msg["device_id"]; ok {
				deviceIds := deviceIdsByAccount[accountId]
				deviceIds = append(deviceIds, deviceId)
				deviceIdsByAccount[accountId] = deviceIds
			}

		}
	}

	// Generate a query for each account
	// ex. {"account_id": 1, device_id: {"$in": ["DEVICE01", "DEVICE02"] }}
	for accountId, deviceIds := range deviceIdsByAccount {
		queries = append(queries, bson.M{"account_id": accountId, "device_id": bson.M{"$in": deviceIds}})
	}

	var (
		devices []*mongodb.Device

		Q = bson.M{"$or": queries}

		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("devices").Find(Q).All(&devices)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	var ops = make([]*elastic.BulkOp, len(devices))
	for i, device := range devices {
		// only grab device attributes
		doc := elastic.DeviceDoc(device, nil)
		// remove the profile key so we don't overwrite any profile attributes
		delete(doc, "profile")

		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpUpdate,
			DocumentType: "device",
			Document:     doc,
			Id:           device.DeviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(int(device.AccountId))),
		}
	}

	return ops, nil
}

// Handle events where only the device attributes have been updated
func (h *Worker) handleDevicesCreated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	var (
		deviceIdsByAccount = map[int64][]string{}
		queries            []bson.M
	)

	// Group device ids by their account_id
	for _, msg := range msgs {
		if id, ok := msg["account_id"]; ok {
			accountId, err := strconv.ParseInt(id, 0, 64)
			if err != nil {
				continue
			}

			if deviceId, ok := msg["device_id"]; ok {
				deviceIds := deviceIdsByAccount[accountId]
				deviceIds = append(deviceIds, deviceId)
				deviceIdsByAccount[accountId] = deviceIds
			}

		}
	}

	// Generate a query for each account
	// ex. {"account_id": 1, device_id: {"$in": ["DEVICE01", "DEVICE02"] }}
	for accountId, deviceIds := range deviceIdsByAccount {
		queries = append(queries, bson.M{"account_id": accountId, "device_id": bson.M{"$in": deviceIds}})
	}

	var (
		devices []*mongodb.Device

		Q = bson.M{"$or": queries}

		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("devices").Find(Q).All(&devices)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	var profileQueries []bson.M
	var identifiersByAccountId = map[int32][]string{}

	for _, device := range devices {
		if device.ProfileIdentifier != "" {
			identifiers := identifiersByAccountId[device.AccountId]
			identifiers = append(identifiers, device.ProfileIdentifier)
			identifiersByAccountId[device.AccountId] = identifiers
		}
	}

	for accountId, identifiers := range identifiersByAccountId {
		profileQueries = append(profileQueries, bson.M{"account_id": accountId, "identifier": bson.M{"$in": identifiers}})
	}

	var profiles []*mongodb.Profile

	if len(profileQueries) != 0 {
		Q = bson.M{"$or": profileQueries}
		err = db.C("profiles").Find(Q).All(&profiles)
		if err != nil {
			return nil, errors.Wrap(err, "db.profiles.Find")
		}
	}

	var profilesByIdentifierByAccountId = map[int32]map[string]*mongodb.Profile{}

	for _, profile := range profiles {
		if profile.Identifier == "" {
			continue
		}

		accountId := profile.AccountId
		identifier := profile.Identifier
		// ensure the submap is initialized
		if _, ok := profilesByIdentifierByAccountId[accountId]; !ok {
			profilesByIdentifierByAccountId[accountId] = map[string]*mongodb.Profile{}
		}
		profilesByIdentifierByAccountId[accountId][identifier] = profile
	}

	var ops = make([]*elastic.BulkOp, len(devices))
	for i, device := range devices {
		// only grab device attributes
		var doc elastic.M
		if device.ProfileIdentifier != "" {
			profile := profilesByIdentifierByAccountId[device.AccountId][device.ProfileIdentifier]
			doc = elastic.DeviceDoc(device, profile)
		} else {
			doc = elastic.DeviceDoc(device, nil)
		}

		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpIndex,
			DocumentType: "device",
			Document:     doc,
			Id:           device.DeviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(int(device.AccountId))),
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

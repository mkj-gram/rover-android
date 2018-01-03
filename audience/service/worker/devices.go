package worker

import (
	"strconv"

	"github.com/pkg/errors"
	"golang.org/x/net/context"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

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
		deviceIdsByAccountId = map[int64][]string{}
		queries              []bson.M
	)

	// Group device ids by their account_id
	for _, msg := range msgs {
		id, ok := msg["account_id"]
		if !ok {
			continue
		}

		accountId, err := strconv.ParseInt(id, 0, 64)
		if err != nil {
			continue
		}

		deviceId, ok := msg["device_id"]
		if !ok {
			continue

		}

		deviceIdsByAccountId[accountId] = append(deviceIdsByAccountId[accountId], deviceId)
	}

	// Generate a query for each account
	// ex. {"account_id": 1, device_id: {"$in": ["DEVICE01", "DEVICE02"] }}
	for accountId, deviceIds := range deviceIdsByAccountId {
		queries = append(queries, bson.M{"account_id": accountId, "device_id": bson.M{"$in": deviceIds}})
	}

	// Catch case where this function was called but no messages contain device_ids
	if len(queries) == 0 {
		return []*elastic.BulkOp{}, nil
	}

	var (
		devices  []mongodb.Device
		profiles []mongodb.Profile

		profileQueries                  []bson.M
		identifiersByAccountId          = map[int32][]string{}
		profilesByIdentifierByAccountId = map[int32]map[string]*mongodb.Profile{}

		Q = bson.M{"$or": queries}

		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("devices").Find(Q).All(&devices)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	for _, device := range devices {
		if device.ProfileIdentifier != "" {
			identifiersByAccountId[device.AccountId] = append(identifiersByAccountId[device.AccountId], device.ProfileIdentifier)
		}
	}

	for accountId, identifiers := range identifiersByAccountId {
		profileQueries = append(profileQueries, bson.M{"account_id": accountId, "identifier": bson.M{"$in": identifiers}})
	}

	if len(profileQueries) != 0 {
		Q = bson.M{"$or": profileQueries}
		err = db.C("profiles").Find(Q).All(&profiles)
		if err != nil {
			return nil, errors.Wrap(err, "db.profiles.Find")
		}
	}

	for _, profile := range profiles {
		if profile.Identifier == "" {
			continue
		}

		accountId := profile.AccountId
		identifier := profile.Identifier
		// ensure the sub-map is initialized
		if _, ok := profilesByIdentifierByAccountId[accountId]; !ok {
			profilesByIdentifierByAccountId[accountId] = map[string]*mongodb.Profile{}
		}
		profilesByIdentifierByAccountId[accountId][identifier] = &profile
	}

	var ops = make([]*elastic.BulkOp, len(devices))
	for i, device := range devices {
		// only grab device attributes
		var doc elastic.M
		if device.ProfileIdentifier != "" {
			profile := profilesByIdentifierByAccountId[device.AccountId][device.ProfileIdentifier]
			doc = elastic.DeviceDoc(&device, profile)
		} else {
			doc = elastic.DeviceDoc(&device, nil)
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
			Id:           deviceId,
			IndexName:    h.AccountIndex(accountId),
		}
	}

	return ops, nil
}

func (h *Worker) handleDevicesSetDeviceProfileIdentifier(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	// Parse the messages into an easy reusable structure
	type message struct {
		AccountId  int
		Identifier string
		DeviceId   string
	}

	var (
		messages []message

		identifiersByAccountId = map[int][]string{}
	)

	for _, msg := range msgs {
		var (
			value      string
			accountId  int
			identifier string
			deviceId   string
		)

		value, ok := msg["account_id"]
		if !ok {
			continue
		}

		accountId, err := strconv.Atoi(value)
		if err != nil {
			continue
		}

		identifier, ok = msg["profile_identifier"]
		if !ok {
			continue
		}

		deviceId, ok = msg["device_id"]
		if !ok {
			continue
		}

		identifiersByAccountId[accountId] = append(identifiersByAccountId[accountId], identifier)

		messages = append(messages, message{
			AccountId:  accountId,
			Identifier: identifier,
			DeviceId:   deviceId,
		})
	}

	// lookup all profiles by identifiers
	var queries []bson.M

	for accountId, identifiers := range identifiersByAccountId {
		if len(identifiers) > 0 {
			queries = append(queries, bson.M{"account_id": accountId, "identifier": bson.M{"$in": identifiers}})
		}
	}

	if len(queries) == 0 {
		return []*elastic.BulkOp{}, nil
	}

	var (
		profiles []mongodb.Profile

		Q        = bson.M{"$or": queries}
		db, sess = h.db()
	)

	defer sess.Close()

	err := db.C("profiles").Find(Q).All(&profiles)
	if err != nil {
		return nil, errors.Wrap(err, "db.profiles.Find")
	}

	var (
		// Lookup table
		profileByIdentifierByAccountId = h.profileByIdentifierByAccountId(profiles)

		ops []*elastic.BulkOp
	)

	for _, msg := range messages {
		var (
			deviceId  = msg.DeviceId
			accountId = msg.AccountId
		)

		// Its possible to update the identifier and not have a profile with the same identifier in our system
		doc := elastic.M{"profile_identifier": msg.Identifier}

		if profile, ok := profileByIdentifierByAccountId[msg.AccountId][msg.Identifier]; ok {
			doc["profile"] = elastic.ProfileDoc(profile)
		}

		ops = append(ops, &elastic.BulkOp{
			OpName:       elastic.BulkOpUpdate,
			DocumentType: "device",
			Document:     doc,
			Id:           deviceId,
			IndexName:    h.AccountIndex(strconv.Itoa(accountId)),
		})
	}

	return ops, nil
}

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

func (h *Worker) handleProfileUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	var (
		identifiersByAccountId = h.profileIdentifiersByAccountId(msgs)

		queries []bson.M
	)

	for accountId, identifiers := range identifiersByAccountId {
		queries = append(queries, bson.M{"account_id": accountId, "identifier": bson.M{"$in": identifiers}})
	}

	if len(queries) == 0 {
		return []*elastic.BulkOp{}, nil
	}

	var (
		profiles []mongodb.Profile

		deviceQueries []bson.M
		Q             = bson.M{"$or": queries}

		db, sess = h.db()
	)

	defer sess.Close()

	// Find all profiles by their identifiers
	err := db.C("profiles").Find(Q).All(&profiles)
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesByIdentifier")
	}

	// Construct a device query to find all devices which currently have the profile identifiers
	for accountId, identifiers := range identifiersByAccountId {
		deviceQueries = append(deviceQueries, bson.M{"account_id": accountId, "profile_identifier": bson.M{"$in": identifiers}})
	}

	if len(deviceQueries) == 0 {
		return []*elastic.BulkOp{}, nil
	}

	var (
		// Lookup table
		profileByIdentifierByAccountId = h.profileByIdentifierByAccountId(profiles)

		DQ = bson.M{"$or": deviceQueries}

		ops []*elastic.BulkOp

		results []struct {
			AccountId         int32  `bson:"account_id"`
			DeviceId          string `bson:"device_id"`
			ProfileIdentifier string `bson:"profile_identifier"`
		}
	)

	err = db.C("devices").Find(DQ).Select(bson.M{"account_id": 1, "device_id": 1, "profile_identifier": 1}).All(&results)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	for _, result := range results {
		// Find the profile that is associated with this
		if profile, ok := profileByIdentifierByAccountId[int(result.AccountId)][result.ProfileIdentifier]; ok {
			doc := elastic.M{"profile": elastic.ProfileDoc(profile)}

			ops = append(ops, &elastic.BulkOp{
				OpName:       elastic.BulkOpUpdate,
				IndexName:    h.AccountIndex(strconv.Itoa(int(result.AccountId))),
				DocumentType: "device",
				Id:           result.DeviceId,
				Document:     doc,
			})
		}

	}

	return ops, nil
}

func (h *Worker) handleProfilesDeleted(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {

	profileIdentifiersByAccountId := h.profileIdentifiersByAccountId(msgs)

	// find all devices associated with these identifiers
	var queries []bson.M

	for accountId, identifiers := range profileIdentifiersByAccountId {
		queries = append(queries, bson.M{"account_id": accountId, "profile_identifier": bson.M{"$in": identifiers}})
	}

	if len(queries) == 0 {
		return []*elastic.BulkOp{}, nil
	}

	var (
		Q        = bson.M{"$or": queries}
		db, sess = h.db()
	)

	defer sess.Close()

	var results []struct {
		AccountId         int32  `bson:"account_id"`
		DeviceId          string `bson:"device_id"`
		ProfileIdentifier string `bson:"profile_identifier"`
	}

	err := db.C("devices").Find(Q).Select(bson.M{"account_id": 1, "device_id": 1, "profile_identifier": 1}).All(&results)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	ops := make([]*elastic.BulkOp, 0, len(results))

	for _, result := range results {

		doc := elastic.M{"profile": nil}

		ops = append(ops, &elastic.BulkOp{
			OpName:       elastic.BulkOpUpdate,
			IndexName:    h.AccountIndex(strconv.Itoa(int(result.AccountId))),
			DocumentType: "device",
			Id:           result.DeviceId,
			Document:     doc,
		})

	}

	return ops, nil
}

func (h *Worker) profileIdentifiersByAccountId(msgs []service.Message) map[int32][]string {
	var profileIdentifiersByAccountId = make(map[int32][]string)

	for _, msg := range msgs {
		if i, ok := msg["account_id"]; ok {
			if accountId, err := strconv.ParseInt(i, 0, 32); err == nil {
				if identifier, ok := msg["identifier"]; ok && identifier != "" {
					profileIdentifiersByAccountId[int32(accountId)] = append(profileIdentifiersByAccountId[int32(accountId)], identifier)
				}
			}
		}
	}

	return profileIdentifiersByAccountId
}

func (h *Worker) profileByIdentifierByAccountId(profiles []mongodb.Profile) map[int]map[string]*mongodb.Profile {
	var profileByIdentifierByAccountId = make(map[int]map[string]*mongodb.Profile)

	for _, profile := range profiles {
		if profile.Identifier == "" {
			continue
		}

		// Make sure the sub-map is initialized
		if profileByIdentifierByAccountId[int(profile.AccountId)] == nil {
			profileByIdentifierByAccountId[int(profile.AccountId)] = make(map[string]*mongodb.Profile)
		}

		profileByIdentifierByAccountId[int(profile.AccountId)][profile.Identifier] = &profile

	}

	return profileByIdentifierByAccountId
}

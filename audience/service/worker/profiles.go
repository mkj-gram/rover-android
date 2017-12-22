package worker

import (
	"strconv"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"golang.org/x/net/context"

	"fmt"
	"gopkg.in/mgo.v2/bson"
)

func (h *Worker) profileIds(msgs []service.Message) []string {
	var ids = make([]string, len(msgs))
	for i := range msgs {
		ids[i] = msgs[i]["id"]
	}
	return ids
}

func (h *Worker) handleProfileUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	// do we really need to map by identifiers? why not just do profile id
	profiles, err := h.findProfilesByIds(h.profileIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesByIds")
	}

	var profileByIdentifierByAccountId = map[int32]map[string]*mongodb.Profile{}

	// I need to find all the device ids that belong to each device
	//var identifiersByAccountId = map[int32][]string{}

	for _, profile := range profiles {
		if profile.Identifier != "" {
			// Make sure the sub-map is initialized
			if profileByIdentifierByAccountId[profile.AccountId] == nil {
				profileByIdentifierByAccountId[profile.AccountId] = make(map[string]*mongodb.Profile)
			}

			profileByIdentifierByAccountId[profile.AccountId][profile.Identifier] = &profile
		}
	}

	// find all devices associated with these identifiers
	var queries []bson.M

	for accountId, profileByIdentifier := range profileByIdentifierByAccountId {
		var identifiers []string
		for identifier := range profileByIdentifier {
			identifiers = append(identifiers, identifier)
		}

		queries = append(queries, bson.M{"account_id": accountId, "profile_identifier": bson.M{"$in": identifiers}})
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

	err = db.C("devices").Find(Q).Select(bson.M{"account_id": 1, "device_id": 1, "profile_identifier": 1}).All(&results)
	if err != nil {
		return nil, errors.Wrap(err, "db.devices.Find")
	}

	ops := make([]*elastic.BulkOp, 0, len(results))

	for _, result := range results {
		// Find the profile that is associated with this
		if profile, ok := profileByIdentifierByAccountId[result.AccountId][result.ProfileIdentifier]; ok {
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

	profileIdentifiersByAccountId := h.toProfileIdentifiersByAccountId(msgs)

	fmt.Println(profileIdentifiersByAccountId)
	// find all devices associated with these identifiers
	var queries []bson.M

	for accountId, identifiers := range profileIdentifiersByAccountId {
		queries = append(queries, bson.M{"account_id": accountId, "profile_identifier": bson.M{"$in": identifiers}})
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

func (h *Worker) toProfileIdentifiersByAccountId(msgs []service.Message) map[int32][]string {
	var profileIdentifiersByAccountId = make(map[int32][]string)

	for _, msg := range msgs {
		if i, ok := msg["account_id"]; ok {
			if accountId, err := strconv.ParseInt(i, 0, 32); err == nil {
				if identifier, ok := msg["identifier"]; ok {
					profileIdentifiersByAccountId[int32(accountId)] = append(profileIdentifiersByAccountId[int32(accountId)], identifier)
				}
			}
		}
	}

	return profileIdentifiersByAccountId
}

func (h *Worker) findProfilesByIds(ids []string) ([]mongodb.Profile, error) {
	var (
		db, sess = h.db()

		profiles []mongodb.Profile
		oids     []bson.ObjectId = make([]bson.ObjectId, 0, len(ids))
	)

	for i := range ids {
		if bson.IsObjectIdHex(ids[i]) {
			oids = append(oids, bson.ObjectIdHex(ids[i]))
		}
	}

	defer sess.Close()

	err := db.C("profiles").Find(bson.M{"_id": bson.M{"$in": oids}}).All(&profiles)
	if err != nil {
		return nil, errors.Wrap(err, "db.profiles.Find")
	}

	return profiles, nil
}

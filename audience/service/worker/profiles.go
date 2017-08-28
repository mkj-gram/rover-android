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

func (h *Worker) profileIds(msgs []service.Message) []string {
	var ids = make([]string, len(msgs))
	for i := range msgs {
		ids[i] = msgs[i]["id"]
	}
	return ids
}

func (h *Worker) handleProfileUpdated(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	profiles, err := h.findProfilesByIds(h.profileIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesByIds")
	}

	ops := make([]*elastic.BulkOp, len(profiles))

	for i := range profiles {
		p := &profiles[i]
		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpIndex,
			DocumentType: "profile",
			Document:     elastic.ProfileDoc(p),
			Id:           p.Id.Hex(),
			IndexName:    h.AccountIndex(strconv.Itoa(int(p.AccountId))),
		}
	}

	return ops, nil
}

func (h *Worker) handleProfilesDeleted(ctx context.Context, msgs []service.Message) ([]*elastic.BulkOp, error) {
	ops := make([]*elastic.BulkOp, len(msgs))

	for i, msg := range msgs {
		var (
			profileId = msg["id"]
			accountId = msg["account_id"]
		)

		ops[i] = &elastic.BulkOp{
			OpName:       elastic.BulkOpDelete,
			DocumentType: "profile",
			Document:     nil,
			Id:           profileId,
			IndexName:    h.AccountIndex(accountId),
		}
	}

	return ops, nil
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

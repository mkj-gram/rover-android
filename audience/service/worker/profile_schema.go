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

func (h *Worker) accountIds(msgs []service.Message) []int {
	var ids = make([]int, 0, len(msgs))
	for _, m := range msgs {
		id, err := strconv.Atoi(m["account_id"])
		if err != nil {
			// TODO: handle better?
			panic(err)
			continue
		}
		ids = append(ids, id)
	}
	return ids
}

func (h *Worker) buildMappings(ctx context.Context, msgs []service.Message) ([]*elastic.IndexMapping, error) {
	schemas, err := h.findProfileSchemasByAccountIds(h.accountIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findProfilesSchemasByAccountIds")
	}

	var group = make(map[string][]*mongodb.SchemaAttribute)
	for i := range schemas {
		var acctId = strconv.Itoa(int(schemas[i].AccountId))
		group[acctId] = append(group[acctId], schemas[i])
	}

	var (
		mappings = make([]*elastic.IndexMapping, len(group))

		i int
	)

	for acctId, schema := range group {
		mappings[i] = &elastic.IndexMapping{
			IndexName: h.AccountIndex(acctId),
			Mapping:   elastic.ProfileMapping(elastic.ProfileAttributesMapping(schema)),
		}
		i++
	}

	return mappings, nil
}

func (h *Worker) findProfileSchemasByAccountIds(ids []int) ([]*mongodb.SchemaAttribute, error) {
	var (
		schemaAttrs []*mongodb.SchemaAttribute
	)

	db, sess := h.db()
	defer sess.Close()

	err := db.C("profiles_schemas").Find(bson.M{"account_id": bson.M{"$in": ids}}).All(&schemaAttrs)
	if err != nil {
		return nil, errors.Wrap(err, "db.profiles_schemas.Find")
	}

	return schemaAttrs, nil
}

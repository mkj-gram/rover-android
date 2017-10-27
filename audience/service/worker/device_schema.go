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

func (h *Worker) buildDeviceMappings(ctx context.Context, msgs []service.Message) ([]*elastic.IndexMapping, error) {
	schemas, err := h.findDeviceSchemasByAccountIds(h.accountIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findDeviceSchemasByAccountIds")
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
			Type:      "device",
			IndexName: h.AccountIndex(acctId),
			Mapping:   elastic.DeviceMapping(elastic.CustomAttributesMapping(schema)),
		}
		i++
	}

	return mappings, nil
}

func (h *Worker) findDeviceSchemasByAccountIds(ids []int) ([]*mongodb.SchemaAttribute, error) {
	var (
		schemaAttrs []*mongodb.SchemaAttribute
	)

	db, sess := h.db()
	defer sess.Close()

	err := db.C("devices_schemas").Find(bson.M{"account_id": bson.M{"$in": ids}}).All(&schemaAttrs)
	if err != nil {
		return nil, errors.Wrap(err, "devices_schemas.Find")
	}

	return schemaAttrs, nil
}

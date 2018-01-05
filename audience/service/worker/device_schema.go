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
	deviceSchemas, err := h.findDeviceSchemasByAccountIds(h.accountIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findDeviceSchemasByAccountIds")
	}

	profileSchemas, err := h.findProfileSchemasByAccountIds(h.accountIds(msgs))
	if err != nil {
		return nil, errors.Wrap(err, "findProfileSchemasByAccountIds")
	}

	var (
		deviceSchemaByAccount  = byAccountId(deviceSchemas)
		profileSchemaByAccount = byAccountId(profileSchemas)

		schemaToMapping = elastic.CustomAttributesMapping

		i int

		mappings = make([]*elastic.IndexMapping, len(deviceSchemaByAccount))
	)

	for acctId := range deviceSchemaByAccount {
		var (
			deviceMapping  = schemaToMapping(deviceSchemaByAccount[acctId])
			profileMapping = schemaToMapping(profileSchemaByAccount[acctId])
		)

		mappings[i] = &elastic.IndexMapping{
			IndexName: h.AccountIndex(strconv.Itoa(acctId)),
			Type:      "device",
			Mapping:   elastic.DeviceV2Mapping(deviceMapping, profileMapping),
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

func byAccountId(schemas []*mongodb.SchemaAttribute) map[int][]*mongodb.SchemaAttribute {
	var group = make(map[int][]*mongodb.SchemaAttribute)
	for i := range schemas {
		var acctId = int(schemas[i].AccountId)
		group[acctId] = append(group[acctId], schemas[i])
	}

	return group
}

package mongodb

import (
	"sort"

	"github.com/pkg/errors"
	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	"golang.org/x/net/context"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// validateUpdateWithSchema returns an error if an attrUpdates doesn't
// validate against existing attribute schema.
// Otherwise it returns attribtue names having no schema
func validateUpdateWithSchema(schemaAttrs []*SchemaAttribute, attrUpdates map[string]*audience.Value) ([]string, error) {
	var (
		// map of schema's attributeName -> AttributeType
		attrsByName = make(map[string]string)
		// attributes with no schema
		schemaLess []string
	)

	// populate the schema map
	for _, sa := range schemaAttrs {
		attrsByName[sa.Attribute] = sa.AttributeType
	}

	// go through the attribute updates and validate types
	// put attributes that don't have schema defined into schemaLess array
	for aname, value := range attrUpdates {
		typ, ok := attrsByName[aname]

		if !ok {
			schemaLess = append(schemaLess, aname)
			continue
		}

		// figure out the attribute type from the ValueUpdate
		attrType, err := audience.ValueToTypeName(value)
		if err != nil {
			return nil, wrapError(err, "ValidateAttribute")
		}

		// null values are valid values for all types
		if attrType == audience.NullType {
			continue
		}

		// ensure types match
		if attrType != typ {
			err := ErrorInvalidArgument{
				error:        errors.New("TypeMismatch"),
				ArgumentName: aname,
				Value:        errors.Errorf("attr[type]=%q[%s] got=%s", aname, typ, attrType),
			}
			return nil, err
		}
	}

	return schemaLess, nil
}

// updateSchema inserts provided SchemaAttributes into the DB
func updateSchema(ctx context.Context, coll *mgo.Collection, schemaUpdateAttrs []*SchemaAttribute) error {
	if len(schemaUpdateAttrs) == 0 {
		// nothing to do
		return nil
	}

	// since []*SchemaAttribute isn't covariant to []interface{}
	// explicit conversion is required, so .Insert can take whole collection to insert
	var insert = make([]interface{}, len(schemaUpdateAttrs))
	for i := range schemaUpdateAttrs {
		insert[i] = schemaUpdateAttrs[i]
	}

	return wrapError(coll.Insert(insert...), "schema.Insert")
}

// buildSchema builds a list of attributes based on the provided update
func (s *mongoStore) buildSchema(ctx context.Context, account_id int32, attrs map[string]*audience.Value, schemaLess []string) ([]*SchemaAttribute, error) {
	var (
		schemaAttrs []*SchemaAttribute
		now         = s.timeNow()
	)

	// defined order
	sort.Strings(schemaLess)

	for i := range schemaLess {
		var attrName, value = schemaLess[i], attrs[schemaLess[i]]

		attrType, err := audience.ValueToTypeName(value)
		if err != nil {
			errorf("ValueUpdateToTypeName: %s=%v: %v", attrName, value, err)
			continue
		}

		// null values are untyped: no schema affected
		if attrType == audience.NullType {
			continue
		}

		var schemaAttr = SchemaAttribute{
			Id:            s.newObjectId(),
			AccountId:     account_id,
			CreatedAt:     now,
			Attribute:     attrName,
			AttributeType: attrType,
		}

		schemaAttrs = append(schemaAttrs, &schemaAttr)
	}

	return schemaAttrs, nil
}

// updateAttributes translates valueUpdates to mongodb updates and runs them
func updateAttributes(ctx context.Context, coll *mgo.Collection, attrs map[string]*audience.Value, ids ...bson.ObjectId) (err error) {
	debugf(coll.Name+".UpdateAttributes: [%v]: %#v", ids, attrs)

	var set = bson.M{}

	for attrName, value := range attrs {
		var attribute = "attributes." + attrName
		// Convert the protobuf value to a golang value
		val, err := value.Value()
		if err != nil {
			panic(err)
		}

		set[attribute] = val
	}

	var update = bson.M{}

	if len(set) > 0 {
		update["$set"] = set
	}

	if len(update) == 0 {
		debugf(coll.Name+".Update: empty: skipping update: ids=[%v]", ids)
		return nil
	}

	debugf(coll.Name+".Update: Bson: ids=[%v]: %+v", ids, update)

	if _, err := coll.UpdateAll(bson.M{"_id": bson.M{"$in": ids}}, update); err != nil {
		return wrapError(err, "profiles.UpdateId")
	}

	return nil
}

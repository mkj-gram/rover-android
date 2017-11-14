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
func validateUpdateWithSchema(schemaAttrs []*SchemaAttribute, attrUpdates map[string]*audience.ValueUpdates) ([]string, error) {
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
	for aname, updates := range attrUpdates {
		typ, ok := attrsByName[aname]

		if !ok {
			schemaLess = append(schemaLess, aname)
			continue
		}

		if len(updates.GetValues()) == 0 {
			errorf("ValueUpdate: %q: empty", aname)
			continue
		}

		// TODO:
		// ensure all updates are same type | null
		var valueUpdate = updates.GetValues()[0]

		// figure out the attribute type from the ValueUpdate
		attrType, err := audience.ValueUpdateToTypeName(valueUpdate)
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
func (s *mongoStore) buildSchema(ctx context.Context, account_id int32, attrs map[string]*audience.ValueUpdates, schemaLess []string) ([]*SchemaAttribute, error) {
	var (
		schemaAttrs []*SchemaAttribute
		now         = s.timeNow()
	)

	// defined order
	sort.Strings(schemaLess)

	for i := range schemaLess {
		var attrName, valueUpdates = schemaLess[i], attrs[schemaLess[i]]

		if len(valueUpdates.GetValues()) == 0 {
			errorf("ValueUpdates: %q: empty", attrName)
			continue
		}

		// take first ValueUpdate
		// it can be either SET with a type or
		// ADD|REMOVE for a string array
		valueUpdate := valueUpdates.GetValues()[0]

		attrType, err := audience.ValueUpdateToTypeName(valueUpdate)
		if err != nil {
			errorf("ValueUpdateToTypeName: %s=%v: %v", attrName, valueUpdate, err)
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
func updateAttributes(ctx context.Context, coll *mgo.Collection, attrs map[string]*audience.ValueUpdates, ids ...bson.ObjectId) (err error) {
	debugf(coll.Name+".UpdateAttributes: [%v]: %#v", ids, attrs)
	// TODO:
	// mongo doesn't allow pulls/pushes in same update
	// but our model does allow
	// so we need to separate pulls/pushes into separate calls
	var (
		sets   = bson.M{}
		pulls  = map[string][]string{}
		pushes = map[string][]string{}
	)

	for k, vUpdate := range attrs {
		var attr_name = "attributes." + k
		for _, u := range vUpdate.GetValues() {
			switch u.UpdateType {
			case audience.ValueUpdate_SET:
				if u.Value == nil {
					continue
				}
				val, err := u.Value.Value()
				if err != nil {
					// TODO: handle error
					panic(err)
				}
				sets[attr_name] = val
			case audience.ValueUpdate_REMOVE:
				pulls[attr_name] = append(pulls[attr_name], u.GetValue().GetStringValue())
			case audience.ValueUpdate_ADD:
				pushes[attr_name] = append(pushes[attr_name], u.GetValue().GetStringValue())
			}
		}
	}

	var update = bson.M{}

	if len(sets) > 0 {
		update["$set"] = sets
	}
	if len(pulls) > 0 {
		var _pulls = bson.M{}
		for k, v := range pulls {
			_pulls[k] = bson.M{"$in": v}
		}
		update["$pull"] = _pulls
	}
	if len(pushes) > 0 {
		var _pushes = bson.M{}
		for k, v := range pushes {
			_pushes[k] = bson.M{"$each": v}
		}
		update["$push"] = _pushes
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

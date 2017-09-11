package mongodb

import (
	"errors"
	"time"

	"golang.org/x/net/context"

	"gopkg.in/mgo.v2/bson"
	// "github.com/gogo/protobuf/jsonpb"
	audience "github.com/roverplatform/rover/apis/go/audience/v1"
)

type dynamicSegmentsStore struct {
	*mongoStore
}

type DynamicSegment struct {
	CreatedAt time.Time `bson:"created_at"`
	UpdatedAt time.Time `bson:"updated_at"`

	Id         bson.ObjectId `bson:"_id"`
	AccountId  int32         `bson:"account_id"`
	Title      string        `bson:"title"`
	IsArchived bool          `bson:"is_archived"`

	SegmentSize int64 `bson:"segment_size"`

	PredicateAggregate *predicateAggregate `bson:"predicate_aggregate"`
}

func (ds *DynamicSegment) toProto(proto *audience.DynamicSegment) error {
	proto.CreatedAt, _ = timeToProto(&ds.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(&ds.UpdatedAt)

	proto.Id = ds.Id.Hex()
	proto.AccountId = ds.AccountId
	proto.Title = ds.Title
	proto.IsArchived = ds.IsArchived
	proto.SegmentSize = ds.SegmentSize

	if ds.PredicateAggregate != nil {
		proto.PredicateAggregate = ds.PredicateAggregate.PredicateAggregate
	}

	return nil
}

// FindDynamicSegmentById finds a dynamic segment by id
func (s *dynamicSegmentsStore) FindDynamicSegmentById(ctx context.Context, segment_id string) (*audience.DynamicSegment, error) {
	var (
		Q = bson.M{
			"_id": bson.ObjectIdHex(segment_id),
		}

		ds DynamicSegment
	)

	if err := s.dynamic_segments().Find(Q).One(&ds); err != nil {
		return nil, wrapError(err, "dynamic_segments.Find")
	}

	var proto audience.DynamicSegment
	if err := ds.toProto(&proto); err != nil {
		return nil, wrapError(err, "dynamic_segment.toProto")
	}

	return &proto, nil
}

// GetDynamicSegmentById finds a dynamic segment by id scoped by account
func (s *dynamicSegmentsStore) GetDynamicSegmentById(ctx context.Context, r *audience.GetDynamicSegmentByIdRequest) (*audience.DynamicSegment, error) {
	var (
		segment_id = r.GetSegmentId()
		account_id = r.GetAuthContext().GetAccountId()

		Q = bson.M{
			"_id":        bson.ObjectIdHex(segment_id),
			"account_id": account_id,
		}

		ds DynamicSegment
	)

	if err := s.dynamic_segments().Find(Q).One(&ds); err != nil {
		return nil, wrapError(err, "dynamic_segments.Find")
	}

	var proto audience.DynamicSegment
	if err := ds.toProto(&proto); err != nil {
		return nil, wrapError(err, "dynamic_segment.toProto")
	}

	return &proto, nil
}

// CreateDynamicSegment creates an empty segment for the account
func (s *dynamicSegmentsStore) CreateDynamicSegment(ctx context.Context, r *audience.CreateDynamicSegmentRequest) (*audience.DynamicSegment, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		pAgg       = r.GetPredicateAggregate()
		title      = r.GetTitle()

		now = s.timeNow()

		ds = DynamicSegment{
			CreatedAt: now,
			UpdatedAt: now,

			Id:        s.newObjectId(),
			AccountId: account_id,
			Title:     title,

			PredicateAggregate: &predicateAggregate{pAgg},
		}
	)

	if err := s.dynamic_segments().Insert(ds); err != nil {
		return nil, wrapError(err, "dynamic_segments.Insert")
	}

	var proto audience.DynamicSegment
	if err := ds.toProto(&proto); err != nil {
		return nil, wrapError(err, "dynamic_segment.toProto")
	}

	return &proto, nil
}

// UpdateDynamicSegmentTitle updates the segment's title
func (s *dynamicSegmentsStore) UpdateDynamicSegmentTitle(ctx context.Context, r *audience.UpdateDynamicSegmentTitleRequest) error {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		segment_id = r.GetSegmentId()
		title      = r.GetTitle()

		now = s.timeNow()

		Q = bson.M{
			"_id":        bson.ObjectIdHex(segment_id),
			"account_id": account_id,
		}
		update = bson.M{"$set": bson.M{
			"title":      title,
			"updated_at": now,
		}}
	)

	if err := s.dynamic_segments().Update(Q, update); err != nil {
		return wrapError(err, "dynamic_segments.Update")
	}

	return nil
}

// UpdateDynamicSegmentArchiveStatus updates the segment's title
func (s *dynamicSegmentsStore) UpdateDynamicSegmentArchiveStatus(ctx context.Context, r *audience.UpdateDynamicSegmentArchiveStatusRequest) error {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		segment_id = r.GetSegmentId()
		archived   = r.GetArchived()

		now = s.timeNow()

		Q = bson.M{
			"_id":        bson.ObjectIdHex(segment_id),
			"account_id": account_id,
		}
		update = bson.M{"$set": bson.M{
			"is_archived": archived,
			"updated_at":  now,
		}}
	)

	if err := s.dynamic_segments().Update(Q, update); err != nil {
		return wrapError(err, "dynamic_segments.Update")
	}

	return nil
}

// UpdateDynamicSegmentPredicates updates the segment's title
func (s *dynamicSegmentsStore) UpdateDynamicSegmentPredicates(ctx context.Context, r *audience.UpdateDynamicSegmentPredicatesRequest) error {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		segment_id = r.GetSegmentId()
		pAggregate = r.GetPredicateAggregate()

		now = s.timeNow()

		Q = bson.M{
			"_id":        bson.ObjectIdHex(segment_id),
			"account_id": account_id,
		}
	)

	var (
		update = bson.M{"$set": bson.M{
			"updated_at":          now,
			"predicate_aggregate": &predicateAggregate{pAggregate},
		}}
	)

	if err := s.dynamic_segments().Update(Q, update); err != nil {
		return wrapError(err, "dynamic_segments.Update")
	}

	return nil
}

func (s *dynamicSegmentsStore) ListDynamicSegments(ctx context.Context, r *audience.ListDynamicSegmentsRequest) ([]*audience.DynamicSegment, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()

		dss []DynamicSegment

		Q = bson.M{
			"account_id": account_id,
		}
	)

	switch r.GetArchivedStatus() {
	case audience.ListDynamicSegmentsRequest_ARCHIVED:
		Q["is_archived"] = true
	case audience.ListDynamicSegmentsRequest_UNARCHIVED:
		Q["is_archived"] = false
	}

	if err := s.dynamic_segments().Find(Q).All(&dss); err != nil {
		return nil, wrapError(err, "dynamic_segments.Find")
	}

	var protoDss = make([]*audience.DynamicSegment, len(dss))

	for i := range dss {
		protoDss[i] = new(audience.DynamicSegment)
		dss[i].toProto(protoDss[i])
	}

	return protoDss, nil
}

type predicateAggregate struct {
	*audience.PredicateAggregate
}

func (pa *predicateAggregate) GetBSON() (interface{}, error) {
	if pa.PredicateAggregate == nil {
		return nil, nil
	}

	var (
		predicates = make([]bson.M, len(pa.Predicates))

		doc = bson.M{
			"condition":  pa.Condition,
			"predicates": predicates,
		}
	)

	for i := range pa.Predicates {

		predicates[i] = bson.M{
			"selector": pa.Predicates[i].GetSelector().String(),
		}

		switch val := pa.Predicates[i].Value.(type) {
		case nil:
			// noop
		case *audience.Predicate_BoolPredicate:
			pp := val.BoolPredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "bool",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
			}

		case *audience.Predicate_StringPredicate:
			pp := val.StringPredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "string",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
			}

		case *audience.Predicate_NumberPredicate:
			pp := val.NumberPredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "number",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
				"value2":         pp.Value2,
			}

		case *audience.Predicate_DatePredicate:
			pp := val.DatePredicate
			t1, _ := protoToTime(pp.Value)
			t2, _ := protoToTime(pp.Value2)
			predicates[i]["predicate"] = bson.M{
				"type":           "date",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          t1,
				"value2":         t2,
			}

		case *audience.Predicate_VersionPredicate:
			pp := val.VersionPredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "version",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
				"value2":         pp.Value2,
			}

		case *audience.Predicate_GeofencePredicate:
			pp := val.GeofencePredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "geofence",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
			}

		case *audience.Predicate_DoublePredicate:
			pp := val.DoublePredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "double",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
				"value2":         pp.Value2,
			}

		case *audience.Predicate_ArrayStringPredicate:
			pp := val.ArrayStringPredicate
			predicates[i]["predicate"] = bson.M{
				"type":           "array[string]",
				"attribute_name": pp.AttributeName,
				"op":             pp.Op,
				"value":          pp.Value,
			}

		default:
			errorf("predicateAggregate: GetBSON: unknown type: %T", val)
		}
	}

	return doc, nil
}

func (pagg *predicateAggregate) SetBSON(raw bson.Raw) error {
	var doc bson.M

	if err := raw.Unmarshal(&doc); err != nil {
		return wrapError(err, "raw.Unmarshal")
	}
	debugf("predicate aggregate: %T: %#v", doc, doc)

	docPredicates, ok := doc["predicates"].([]interface{})
	if !ok {
		return wrapError(errors.New("predicates: invalid value"), "raw.Unmarshal")
	}

	pagg.PredicateAggregate = new(audience.PredicateAggregate)
	// shortcut
	pa := pagg.PredicateAggregate

	switch val := doc["condition"].(type) {
	case int:
		pa.Condition = audience.PredicateAggregate_Condition(val)
	case float64:
		pa.Condition = audience.PredicateAggregate_Condition(val)
	default:
		errorf("unknown condition type: %T", val)
	}

	for _, p := range docPredicates {
		pdoc, ok := p.(bson.M)
		if !ok {
			errorf("fetching document: %+v", p)
			continue
		}

		pdef, ok := pdoc["predicate"].(bson.M)
		if !ok {
			errorf("predicate definition is not defined", p)
		}

		ptype, ok := pdef["type"].(string)
		if !ok {
			errorf("predicate type attribute is not a string", p)
			continue
		}

		pselector, ok := pdoc["selector"].(string)
		if !ok {
			errorf("predicate selector is not a string", p)
			continue
		}

		selector := audience.Predicate_Selector(audience.Predicate_Selector_value[pselector])

		switch ptype {
		case "bool":
			var pp audience.BoolPredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_BoolPredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.BoolPredicate_Op(v)
			} else {
				// TODO: log
			}
			pp.Value, _ = pdef["value"].(bool)

		case "string":
			var pp audience.StringPredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_StringPredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.StringPredicate_Op(v)
			} else {
				// TODO: log
			}
			pp.Value, _ = pdef["value"].(string)

		case "number":
			var pp audience.NumberPredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_NumberPredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.NumberPredicate_Op(v)
			} else {
				// TODO: log
			}
			pp.Value, _ = pdef["value"].(int64)
			pp.Value2, _ = pdef["value2"].(int64)

		case "date":
			var pp audience.DatePredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_DatePredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.DatePredicate_Op(v)
			} else {
				// TODO: log
			}

			if val, ok := pdef["value"].(time.Time); ok {
				pp.Value, _ = timeToProto(&val)
			}
			if val, ok := pdef["value2"].(time.Time); ok {
				pp.Value2, _ = timeToProto(&val)
			}
		case "version":
			var pp audience.VersionPredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_VersionPredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.VersionPredicate_Op(v)
			} else {
				// TODO: log
			}
			toVersion := func(doc bson.M, key string) *audience.Version {
				val, ok := doc[key].(bson.M)
				if !ok {
					debugf("no such key %q in %#v", key, doc)
					return nil
				}
				var ver audience.Version
				if v, ok := val["major"].(int); ok {
					ver.Major = int32(v)
				}
				if v, ok := val["minor"].(int); ok {
					ver.Minor = int32(v)
				}
				if v, ok := val["revision"].(int); ok {
					ver.Revision = int32(v)
				}
				return &ver
			}
			pp.Value = toVersion(pdef, "value")
			pp.Value2 = toVersion(pdef, "value2")

		case "geofence":
			var pp audience.GeofencePredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_GeofencePredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.GeofencePredicate_Op(v)
			} else {
				// TODO: log
			}
			vloc, ok := pdef["value"].(bson.M)
			if !ok {
				// TODO: log
				continue
			}
			pp.Value = &audience.GeofencePredicate_Location{}
			pp.Value.Latitude, _ = vloc["latitude"].(float64)
			pp.Value.Longitude, _ = vloc["longitude"].(float64)
			pp.Value.Name, _ = vloc["name"].(string)
			if v, ok := vloc["radius"].(int); ok {
				pp.Value.Radius = int32(v)
			}

		case "double":
			var pp audience.DoublePredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_DoublePredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.DoublePredicate_Op(v)
			} else {
				// TODO: log
			}
			pp.Value, _ = pdef["value"].(float64)
			pp.Value2, _ = pdef["value2"].(float64)

		case "array[string]":
			var pp audience.ArrayStringPredicate
			pa.Predicates = append(pa.Predicates, &audience.Predicate{Selector: selector, Value: &audience.Predicate_ArrayStringPredicate{&pp}})

			pp.AttributeName, _ = pdef["attribute_name"].(string)
			if v, ok := pdef["op"].(int); ok {
				pp.Op = audience.ArrayStringPredicate_Op(v)
			} else {
				// TODO: log
			}
			val, _ := pdef["value"].([]interface{})

			pp.Value = make([]string, len(val))
			for i, v := range val {
				if vstring, ok := v.(string); ok {
					pp.Value[i] = vstring
				} else {
					// TODO: log
				}
			}

		default:
			errorf("unknown predicate type: %q", ptype)
		}
	}

	return nil
}

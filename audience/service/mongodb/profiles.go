package mongodb

import (
	"sort"
	"strings"
	"time"

	"golang.org/x/net/context"

	"gopkg.in/mgo.v2/bson"

	"github.com/pkg/errors"
	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

type profilesStore struct {
	*mongoStore
}

type ProfileAttributesUpdates map[string]*audience.ValueUpdates

type Profile struct {
	Id         bson.ObjectId `bson:"_id"`
	AccountId  int32         `bson:"account_id"`
	Identifier string        `bson:"identifier,omitempty"`
	CreatedAt  *time.Time    `bson:"created_at"`
	UpdatedAt  *time.Time    `bson:"updated_at"`

	// profile attributes
	Attributes map[string]interface{} `bson:"attributes,omitempty"`
}

func (p *Profile) fromProto(proto *audience.Profile) error {
	var err error

	p.Id, err = StringToObjectID(proto.GetId())
	if err != nil {
		return wrapError(err, "StringToObjectID")
	}

	p.AccountId = proto.GetAccountId()
	p.Identifier = proto.GetIdentifier()
	p.CreatedAt, _ = protoToTime(proto.CreatedAt)
	p.UpdatedAt, _ = protoToTime(proto.UpdatedAt)

	if len(proto.Attributes) > 0 {
		p.Attributes = make(map[string]interface{})
		for k, v := range proto.Attributes {
			// TODO: handle errors
			var err error
			p.Attributes[k], err = v.Value()
			if err != nil {
				panic(err)
			}
		}
	}

	return nil
}

func (p *Profile) toProto(proto *audience.Profile) error {
	proto.AccountId = p.AccountId
	proto.Identifier = p.Identifier
	proto.Id = p.Id.Hex()

	proto.CreatedAt, _ = timeToProto(p.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(p.UpdatedAt)

	if len(p.Attributes) > 0 {
		proto.Attributes = make(map[string]*audience.Value)
		for k, v := range p.Attributes {
			var val audience.Value
			// TODO: handle errors
			if err := val.Load(v); err != nil {
				panic(err)
			}
			proto.Attributes[k] = &val
		}
	}

	return nil
}

type ProfileSchema struct {
	Attributes []*SchemaAttribute
}

func (ps *ProfileSchema) toProto(proto *audience.ProfileSchema) error {
	for _, v := range ps.Attributes {
		var protoattr audience.SchemaAttribute
		_ = v.toProto(&protoattr)
		proto.Attributes = append(proto.Attributes, &protoattr)
	}

	return nil
}

func (ps *ProfileSchema) fromProto(proto *audience.ProfileSchema) error {
	for _, v := range proto.Attributes {
		var sattr SchemaAttribute
		_ = sattr.fromProto(v)
		ps.Attributes = append(ps.Attributes, &sattr)
	}

	return nil
}

type SchemaAttribute struct {
	Id            bson.ObjectId `bson:"_id"`
	AccountId     int32         `bson:"account_id"`
	Attribute     string        `bson:"attribute"`
	AttributeType string        `bson:"attribute_type"`
	Label         string        `bson:"label"`
	CreatedAt     time.Time     `bson:"created_at"`
}

func (p *SchemaAttribute) fromProto(proto *audience.SchemaAttribute) error {
	var err error

	p.Id, err = StringToObjectID(proto.GetId())
	if err != nil {
		return wrapError(err, "StringToObjectID")
	}

	p.AccountId = proto.AccountId
	p.Attribute = proto.Attribute
	p.AttributeType = proto.AttributeType
	p.Label = proto.Label

	p.CreatedAt, _ = timestamp.Time(proto.CreatedAt)

	return nil
}

func (p *SchemaAttribute) toProto(proto *audience.SchemaAttribute) error {
	proto.Id = p.Id.Hex()
	proto.AccountId = p.AccountId
	proto.Attribute = p.Attribute
	proto.AttributeType = p.AttributeType
	proto.Label = p.Label
	if p.Label == "" {
		proto.Label = p.Attribute
	}

	proto.CreatedAt, _ = timestamp.TimestampProto(p.CreatedAt)

	return nil
}

func (s *profilesStore) FindProfileById(ctx context.Context, id string) (*audience.Profile, error) {

	pid, err := StringToObjectID(id)
	if err != nil {
		return nil, wrapError(err, "StringToObjectID")
	}

	var pf Profile

	if err := s.profiles().FindId(pid).One(&pf); err != nil {
		return nil, wrapError(err, "profiles.FindId")
	}

	var proto audience.Profile
	if err := pf.toProto(&proto); err != nil {
		return nil, wrapError(err, "Profile.toProto")
	}

	return &proto, nil
}

// CreateProfile creates an empty Profile for the account
func (s *profilesStore) CreateProfile(ctx context.Context, r *audience.CreateProfileRequest) (*audience.Profile, error) {

	var (
		now = s.timeNow()

		p = Profile{
			Id:         s.newObjectId(),
			AccountId:  r.GetAuthContext().GetAccountId(),
			Attributes: nil,
			CreatedAt:  &now,
			UpdatedAt:  &now,
		}
	)

	if err := s.profiles().Insert(p); err != nil {
		return nil, wrapError(err, "profiles.Insert")
	}

	var proto audience.Profile
	if err := p.toProto(&proto); err != nil {
		return nil, wrapError(err, "profile.toProto")
	}

	return &proto, nil
}

// GetProfile returns a account profile given the ids
func (s *profilesStore) GetProfile(ctx context.Context, r *audience.GetProfileRequest) (*audience.Profile, error) {

	profile_oid, err := StringToObjectID(r.GetProfileId())
	if err != nil {
		err = ErrorInvalidArgument{
			error:        err,
			ArgumentName: "ProfileId",
			Value:        r.GetProfileId(),
		}
		return nil, wrapError(err, "StringToObjectID")
	}

	var (
		account_id = r.GetAuthContext().GetAccountId()

		p Profile
		Q = bson.M{
			"_id":        profile_oid,
			"account_id": account_id,
		}
	)

	if err := s.profiles().Find(Q).One(&p); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var pp audience.Profile
	if err := p.toProto(&pp); err != nil {
		return nil, wrapError(err, "profile.toProto")
	}

	return &pp, nil
}

func (s *profilesStore) DeleteProfile(ctx context.Context, r *audience.DeleteProfileRequest) error {
	var (
		account_id = r.GetAuthContext().GetAccountId()
	)

	id, err := StringToObjectID(r.GetProfileId())
	if err != nil {
		err = ErrorInvalidArgument{
			error:        err,
			ArgumentName: "ProfileId",
			Value:        r.GetProfileId(),
		}
		return wrapError(err, "StringToObjectID")
	}

	Q := bson.M{
		"_id":        id,
		"account_id": account_id,
	}

	if err := s.profiles().Remove(Q); err != nil {
		return wrapError(err, "profiles.Remove")
	}

	return nil
}

func (s *profilesStore) GetProfileByDeviceId(ctx context.Context, r *audience.GetProfileByDeviceIdRequest) (*audience.Profile, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		device_id  = r.GetDeviceId()

		d bson.M

		dq = bson.M{
			"device_id":  device_id,
			"account_id": account_id,
		}
	)

	if err := s.devices().Find(dq).Select(bson.M{"profile_id": 1}).One(&d); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var (
		p Profile

		pq = bson.M{
			"_id":        d["profile_id"],
			"account_id": account_id,
		}
	)

	if err := s.profiles().Find(pq).One(&p); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var proto audience.Profile
	if err := p.toProto(&proto); err != nil {
		return nil, wrapError(err, "profile.toProto")
	}

	return &proto, nil
}

func (s *profilesStore) GetProfileByIdentifier(ctx context.Context, r *audience.GetProfileByIdentifierRequest) (*audience.Profile, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		identifier = r.GetIdentifier()

		p Profile

		Q = bson.M{
			"account_id": account_id,
			"identifier": identifier,
		}
	)

	if err := s.profiles().Find(Q).One(&p); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var proto audience.Profile
	if err := p.toProto(&proto); err != nil {
		return nil, wrapError(err, "profile.toProto")
	}

	return &proto, nil
}

func (s *profilesStore) ListProfilesByIds(ctx context.Context, r *audience.ListProfilesByIdsRequest) ([]*audience.Profile, error) {
	var (
		account_id  = r.GetAuthContext().GetAccountId()
		profile_ids = r.GetProfileIds()

		profile_oids = make([]bson.ObjectId, len(profile_ids))
	)

	for i := range profile_ids {
		poid, err := StringToObjectID(profile_ids[i])
		if err != nil {
			err = ErrorInvalidArgument{
				error:        err,
				ArgumentName: "ProfileId",
				Value:        profile_ids[i],
			}
			return nil, wrapError(err, "StringToObjectID")
		}
		profile_oids[i] = poid
	}

	var (
		profiles []Profile

		Q = bson.M{"account_id": account_id, "_id": bson.M{"$in": profile_oids}}
	)

	if err := s.profiles().Find(Q).Sort("_id").All(&profiles); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var protoProfiles = make([]*audience.Profile, len(profiles))
	for i := range profiles {
		protoProfiles[i] = new(audience.Profile)
		profiles[i].toProto(protoProfiles[i])
	}

	return protoProfiles, nil
}

func (s *profilesStore) ListProfilesByIdentifiers(ctx context.Context, r *audience.ListProfilesByIdentifiersRequest) ([]*audience.Profile, error) {
	var (
		account_id          = r.GetAuthContext().GetAccountId()
		profile_identifiers = r.GetProfileIdentifiers()
	)

	var (
		profiles []Profile

		Q = bson.M{"account_id": account_id, "identifier": bson.M{"$in": profile_identifiers}}
	)

	if err := s.profiles().Find(Q).Sort("_id").All(&profiles); err != nil {
		return nil, wrapError(err, "profiles.Find")
	}

	var protoProfiles = make([]*audience.Profile, len(profiles))
	for i := range profiles {
		protoProfiles[i] = new(audience.Profile)
		profiles[i].toProto(protoProfiles[i])
	}

	return protoProfiles, nil
}

func (s *profilesStore) GetProfileSchema(ctx context.Context, r *audience.GetProfileSchemaRequest) (*audience.ProfileSchema, error) {
	var (
		account_id = r.GetAuthContext().GetAccountId()
	)

	schema, err := s.getProfileSchema(ctx, account_id)
	if err != nil {
		return nil, wrapError(err, "getProfileSchema")
	}

	var proto audience.ProfileSchema
	if err := schema.toProto(&proto); err != nil {
		return nil, wrapError(err, "schema.toProto")
	}

	return &proto, nil
}

func (s *profilesStore) getProfileSchema(ctx context.Context, account_id int32) (*ProfileSchema, error) {
	var (
		schema ProfileSchema
	)

	iter := s.profiles_schemas().
		Find(bson.M{"account_id": account_id}).
		Sort("_id").
		Iter()

	for !iter.Done() {
		var sa SchemaAttribute

		if !iter.Next(&sa) {
			if err := iter.Err(); err != nil {
				s.log.Debugf("iter.Next: %s", err)
			}
			continue
		}

		schema.Attributes = append(schema.Attributes, &sa)
	}

	if err := iter.Close(); err != nil {
		return nil, wrapError(err, "iter.Close")
	}

	return &schema, nil
}
func (s *profilesStore) UpdateProfileIdentifier(ctx context.Context, r *audience.UpdateProfileIdentifierRequest) error {
	var (
		account_id = r.GetAuthContext().GetAccountId()
		profile_id = r.GetProfileId()
		identifier = r.GetIdentifier()

		now = s.timeNow()

		update = bson.M{
			"identifier": identifier,
			"updated_at": now,
		}
	)

	err := s.profiles().Update(bson.M{
		"_id":        bson.ObjectIdHex(profile_id),
		"account_id": account_id,
	}, bson.M{"$set": update})
	if err != nil {
		return wrapError(err, "profiles.Update")
	}

	return nil
}

// UpdateProfile updates the profile
//
// 1. validate attributes against profile schema
// 2. collect attributes that have no schema
// 3. create schema for the attributes with no schema
// 4. error if an attribute doesn't match the schema type
// 5. if no errros
// 6. update attributes
// 7. update schema
//
func (s *profilesStore) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) error {
	var (
		profile_id  = r.GetProfileId()
		account_id  = r.GetAuthContext().GetAccountId()
		attrUpdates = r.GetAttributes()

		p Profile
	)

	err := s.profiles().Find(bson.M{
		"_id":        bson.ObjectIdHex(profile_id),
		"account_id": account_id,
	}).One(&p)

	if err != nil {
		return wrapError(err, "profiles.Find")
	}

	// schema is a bag of `SchemaAttribute`s
	schema, err := s.getProfileSchema(ctx, account_id)
	if err != nil {
		return wrapError(err, "getProfileSchema")
	}

	// at this point update either get accepted or rejected if there's
	// an attribute that doesn't match the schema.
	schemaLess, err := s.validateProfileAttributes(schema, attrUpdates)
	if err != nil {
		return wrapError(err, "SchemaValidation")
	}

	// now for all the schemaLess attributes create the corresponding schema
	if len(schemaLess) > 0 {
		schemaUpdate, err := s.generateProfileSchema(ctx, account_id, attrUpdates, schemaLess)
		if err != nil {
			return wrapError(err, "generateProfileSchema")
		}

		if err := s.updateSchema(ctx, schemaUpdate); err != nil {
			return wrapError(err, "updateSchema")
		}
	}

	//`schemaLess` contains names of the attributes that do not have schema defined yet
	// but before updating the attribute schema let's persist the the profile attributes updates first
	if err := s.updateProfileAttributes(ctx, p.Id.Hex(), attrUpdates); err != nil {
		return wrapError(err, "updateProfileAttributes")
	}

	return nil
}

// updateSchema inserts provided SchemaAttributes into the DB
func (s *profilesStore) updateSchema(ctx context.Context, schemaUpdate *ProfileSchema) error {
	if len(schemaUpdate.Attributes) == 0 {
		// nothing to do
		return nil
	}

	// since []*SchemaAttribute isn't covariant to []interface{}
	// explicit conversion is required, so .Insert can take whole collection to insert
	var insert = make([]interface{}, len(schemaUpdate.Attributes))
	for i := range schemaUpdate.Attributes {
		insert[i] = schemaUpdate.Attributes[i]
	}

	return wrapError(s.profiles_schemas().Insert(insert...), "profiles_schemas.Insert")
}

// validateProfileAttributes returns an error if an attrUpdates doesn't validate against existing attribute schema.
// Otherwise it returns attribtue names having no schema
func (s *profilesStore) validateProfileAttributes(schema *ProfileSchema, attrUpdates map[string]*audience.ValueUpdates) ([]string, error) {
	var (
		// map of schema's attributeName -> AttributeType
		schemaAttrs = make(map[string]string)
		// attributes with no schema
		schemaLess []string
	)

	// populate the schema map
	for _, sa := range schema.Attributes {
		schemaAttrs[sa.Attribute] = sa.AttributeType
	}

	// go through the attribute updates and validate types
	// put attributes that don't have schema defined into schemaLess array
	for aname, updates := range attrUpdates {
		typ, ok := schemaAttrs[strings.ToLower(aname)]
		if !ok {
			schemaLess = append(schemaLess, aname)
			continue
		}

		if len(updates.GetValues()) == 0 {
			s.log.Errorf("ValueUpdate: %q: empty", aname)
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

func (s *profilesStore) generateProfileSchema(ctx context.Context, account_id int32, attrs map[string]*audience.ValueUpdates, schemaLess []string) (*ProfileSchema, error) {
	var (
		schemaAttrs []*SchemaAttribute
		now         = s.timeNow()
	)

	// defined order
	sort.Strings(schemaLess)

	for i := range schemaLess {
		var attrName, valueUpdates = schemaLess[i], attrs[schemaLess[i]]

		if len(valueUpdates.GetValues()) == 0 {
			s.log.Errorf("ValueUpdates: %q: empty", attrName)
			continue
		}

		// take first ValueUpdate
		// it can be either SET with a type or
		// ADD|REMOVE for a string array
		valueUpdate := valueUpdates.GetValues()[0]

		attrType, err := audience.ValueUpdateToTypeName(valueUpdate)
		if err != nil {
			s.log.Errorf("ValueUpdateToTypeName: %s=%v: %v", attrName, valueUpdate, err)
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

	return &ProfileSchema{schemaAttrs}, nil
}

func (s *profilesStore) updateProfileAttributes(ctx context.Context, profile_id string, attrs map[string]*audience.ValueUpdates) (err error) {
	s.log.Debugf("profiles.UpdateAttributes : %s: %#v", profile_id, attrs)
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
		s.log.Debugf("profile.Update: empty: skipping update: profile_id=%s", profile_id)
		return nil
	}

	s.log.Debugf("profile.Update: Bson: profile_id=%s: %+v", profile_id, update)

	if err := s.profiles().UpdateId(bson.ObjectIdHex(profile_id), update); err != nil {
		return wrapError(err, "profiles.UpdateId")
	}

	return nil
}

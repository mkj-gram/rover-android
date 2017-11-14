package mongodb

import (
	"time"

	"golang.org/x/net/context"

	"gopkg.in/mgo.v2/bson"

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
		account_id = r.GetAuthContext().GetAccountId()
		identifier = r.GetIdentifier()
		now        = s.timeNow()

		p = Profile{
			Id:         s.newObjectId(),
			AccountId:  account_id,
			Attributes: nil,
			CreatedAt:  &now,
			UpdatedAt:  &now,
		}
	)

	if identifier != "" {
		p.Identifier = identifier
	}

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

		d Device

		dQ = s.devices().
			Find(bson.M{"device_id": device_id, "account_id": account_id}).
			Select(bson.M{"profile_identifier": 1})
	)

	if err := dQ.One(&d); err != nil {
		return nil, wrapError(err, "devices.Find")
	}

	var (
		p Profile

		pQ = s.profiles().
			Find(bson.M{
				"account_id": account_id,
				"identifier": d.ProfileIdentifier,
			})
	)

	if err := pQ.One(&p); err != nil {
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

	err := s.profiles_schemas().
		Find(bson.M{"account_id": account_id}).
		Sort("_id").
		All(&schema.Attributes)

	return &schema, wrapError(err, "profile_schemas.Find")
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
func (s *profilesStore) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) (bool, error) {
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
		return false, wrapError(err, "profiles.Find")
	}

	// schema is a bag of `SchemaAttribute`s
	schema, err := s.getProfileSchema(ctx, account_id)
	if err != nil {
		return false, wrapError(err, "getProfileSchema")
	}

	// the update is accepted in case everything is ok or
	// rejected if there's an attribute that doesn't match the schema.
	schemaLess, err := validateUpdateWithSchema(schema.Attributes, attrUpdates)
	if err != nil {
		return false, wrapError(err, "SchemaValidation")
	}

	// now for all the schemaLess attributes create the corresponding schema
	if len(schemaLess) > 0 {
		schemaUpdateAttrs, err := s.buildSchema(ctx, account_id, attrUpdates, schemaLess)
		if err != nil {
			return false, wrapError(err, "buildSchema")
		}

		if err := updateSchema(ctx, s.profiles_schemas(), schemaUpdateAttrs); err != nil {
			return false, wrapError(err, "profile.updateSchema")
		}

		// ms-12: update device schema as well
		// TODO: remove after ms-12 is done
		if err := updateSchema(ctx, s.devices_schemas(), schemaUpdateAttrs); err != nil {
			return false, wrapError(err, "device.updateSchema")
		}
	}

	//`schemaLess` contains names of the attributes that do not have schema defined yet
	if err := updateAttributes(ctx, s.profiles(), attrUpdates, p.Id); err != nil {
		return false, wrapError(err, "profiles.updateAttributes")
	}

	// ms-12: copy profile updates to all profile devices as well
	// TODO: remove after ms-12 is done
	var (
		deviceDocs []bson.M

		profileDevices = s.devices().
				Find(bson.M{"profile_id": p.Id, "account_id": p.AccountId}).
				Select(bson.M{"_id": 1})
	)

	if err := profileDevices.All(&deviceDocs); err != nil {
		return false, wrapError(err, "profiles.Find")
	}

	if len(deviceDocs) > 0 {
		var deviceOids []bson.ObjectId
		for _, m := range deviceDocs {
			var deviceId, ok = m["_id"].(bson.ObjectId)
			if !ok {
				errorf("deviceIdToObjectId: no key: %v", m["_id"])
				continue
			}
			deviceOids = append(deviceOids, deviceId)
		}

		if err := updateAttributes(ctx, s.devices(), attrUpdates, deviceOids...); err != nil {
			return false, wrapError(err, "devices.updateAttributes")
		}
	}

	return len(schemaLess) > 0, nil
}

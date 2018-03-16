package mongodb

import (
	"sync"
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

var schemaCache = struct {
	cache map[int32][]*SchemaAttribute
	sync.Mutex
}{
	cache: make(map[int32][]*SchemaAttribute),
}

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

func (s *profilesStore) FindProfileByIdentifier(ctx context.Context, accountId int32, identifier string) (*audience.Profile, error) {

	var (
		Q = bson.M{
			"account_id": accountId,
			"identifier": identifier,
		}
		pf Profile
	)

	if err := s.profiles().Find(Q).One(&pf); err != nil {
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
		accountId  = r.GetAuthContext().GetAccountId()
		identifier = r.GetIdentifier()
		now        = s.timeNow()

		p = Profile{
			Id:         s.newObjectId(),
			AccountId:  accountId,
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

// GetProfile returns a account profile given the identifier
func (s *profilesStore) GetProfile(ctx context.Context, r *audience.GetProfileRequest) (*audience.Profile, error) {

	var accountId = r.GetAuthContext().GetAccountId()

	if r.GetIdentifier() != "" {
		return s.GetProfileByIdentifier(ctx, accountId, r.GetIdentifier())
	} else {
		return s.GetProfileById(ctx, accountId, r.GetProfileId())
	}
}

func (s *profilesStore) GetProfileByIdentifier(ctx context.Context, accountId int32, identifier string) (*audience.Profile, error) {
	var (
		p Profile

		Q = bson.M{
			"account_id": accountId,
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

func (s *profilesStore) GetProfileById(ctx context.Context, accountId int32, id string) (*audience.Profile, error) {
	profileOid, err := StringToObjectID(id)
	if err != nil {
		err = ErrorInvalidArgument{
			error:        err,
			ArgumentName: "ProfileId",
			Value:        id,
		}
		return nil, wrapError(err, "StringToObjectID")
	}

	var (
		p Profile
		Q = bson.M{
			"_id":        profileOid,
			"account_id": accountId,
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
		identifier = r.GetIdentifier()
		accountId  = r.GetAuthContext().GetAccountId()
	)

	if identifier == "" {
		return ErrorInvalidArgument{ArgumentName: "Identifier", Value: identifier}
	}

	var Q = bson.M{
		"account_id": accountId,
		"identifier": identifier,
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

func (s *profilesStore) ListProfilesByIdentifiers(ctx context.Context, r *audience.ListProfilesByIdentifiersRequest) ([]*audience.Profile, error) {
	var (
		accountId          = r.GetAuthContext().GetAccountId()
		profileIdentifiers = r.GetProfileIdentifiers()
	)

	var (
		profiles []Profile

		Q = bson.M{"account_id": accountId, "identifier": bson.M{"$in": profileIdentifiers}}
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

func (s *profilesStore) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) (bool, error) {
	var (
		accountId   = r.GetAuthContext().GetAccountId()
		identifier  = r.GetIdentifier()
		attrUpdates = r.GetAttributes()

		p Profile
	)

	err := s.profiles().Find(bson.M{
		"identifier": identifier,
		"account_id": accountId,
	}).One(&p)

	if err != nil {
		return false, wrapError(err, "profiles.Find")
	}

	// schema is a bag of `SchemaAttribute`s
	schema, err := s.getProfileSchema(ctx, accountId)
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
		schemaUpdateAttrs, err := s.buildSchema(ctx, accountId, attrUpdates, schemaLess)
		if err != nil {
			return false, wrapError(err, "buildSchema")
		}

		if err := updateSchema(ctx, s.profiles_schemas(), schemaUpdateAttrs); err != nil {
			return false, wrapError(err, "profile.updateSchema")
		}
	}

	//`schemaLess` contains names of the attributes that do not have schema defined yet
	if err := updateAttributes(ctx, s.profiles(), attrUpdates, p.Id); err != nil {
		return false, wrapError(err, "profiles.updateAttributes")
	}

	return len(schemaLess) > 0, nil
}

func (s *profilesStore) TagProfile(ctx context.Context, r *audience.TagProfileRequest) (bool, error) {

	var (
		accountId  = r.GetAuthContext().GetAccountId()
		identifier = r.GetIdentifier()
		tags       = r.GetTags()

		didUpdateSchema = false
	)

	ok, err := s.hasProfileSchemaAttribute(ctx, accountId, "tags")
	if err != nil {
		return false, wrapError(err, "hasProfileSchemaAttribute: tags")
	}

	if !ok {
		update := []*SchemaAttribute{{
			Id:            s.newObjectId(),
			AccountId:     accountId,
			Attribute:     "tags",
			AttributeType: "array[string]",
			Label:         "",
			CreatedAt:     s.timeNow(),
		}}
		if err := updateSchema(ctx, s.profiles_schemas(), update); err != nil {
			return false, wrapError(err, "updateSchema")
		}

		didUpdateSchema = true
	}

	err = s.profiles().Update(bson.M{
		"account_id": accountId,
		"identifier": identifier,
	}, bson.M{
		"$addToSet": bson.M{"attributes.tags": bson.M{"$each": tags}},
	})

	if err != nil {
		return false, wrapError(err, "profiles.Update")
	}

	return didUpdateSchema, nil
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

func (s *profilesStore) getProfileSchemaAttribute(ctx context.Context, accountId int32, attribute string) (*SchemaAttribute, error) {

	schemaCache.Lock()
	defer schemaCache.Unlock()

	if schemaCache.cache[accountId] == nil {
		schemaCache.cache[accountId] = []*SchemaAttribute{}
	}

	// check if it exists in cache
	for i := range schemaCache.cache[accountId] {
		var attr = schemaCache.cache[accountId][i]
		if attr.Attribute == attribute {
			return attr, nil
		}
	}

	var schema SchemaAttribute

	err := s.profiles_schemas().
		Find(bson.M{"account_id": accountId, "attribute": attribute}).
		One(&schema)

	if err != nil {
		return nil, wrapError(err, "profile_schemas.Find")
	}

	// place it in the cache
	schemaCache.cache[accountId] = append(schemaCache.cache[accountId], &schema)

	return &schema, nil
}

func (s *profilesStore) hasProfileSchemaAttribute(ctx context.Context, accountId int32, attribute string) (bool, error) {

	_, err := s.getProfileSchemaAttribute(ctx, accountId, attribute)
	if err != nil {
		if _, ok := errors.Cause(err).(ErrorNotFound); ok {
			return false, nil
		}
		return false, wrapError(err, "getProfileSchemaAttribute")
	}

	return true, nil
}

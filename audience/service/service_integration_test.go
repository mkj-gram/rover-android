// +build integration

package service_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/pkg/errors"

	"gopkg.in/mgo.v2/bson"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/go/log"
)

var _ = log.Debug

func TestAudienceService(t *testing.T) {

	var (
		mdb = dialMongo(t, *tMongoDSN)

		profiles         = mdb.C("profiles")
		devices          = mdb.C("devices")
		profiles_schemas = mdb.C("profiles_schemas")
		devices_schemas  = mdb.C("devices_schemas")

		dynamic_segments = mdb.C("dynamic_segments")

		system_profile = mdb.C("system.profile")
	)

	truncateColl(t, profiles, devices, devices_schemas, profiles_schemas, dynamic_segments)

	profile := func(level int) {
		var res bson.M
		if err := mdb.Run(bson.M{"profile": level}, &res); err != nil {
			t.Fatal(err)
		}
	}

	// turn off profiling to truncate collection
	profile(0)
	truncateColl(t, system_profile)
	// turn profiling for all queries
	profile(2)

	// indexes
	if err := mongodb.EnsureIndexes(mdb); err != nil {
		t.Fatalf("EnsureIndexes: %v", err)
	}

	// fixtures
	loadFixture(t, devices, "testdata/devices.json")
	loadFixture(t, devices, "testdata/device-00.bson.json")
	loadFixture(t, profiles, "testdata/profiles.json")
	loadFixture(t, profiles, "testdata/profile-00.bson.json")
	loadFixture(t, profiles_schemas, "testdata/profiles_schemas.json")
	loadFixture(t, devices_schemas, "testdata/devices_schemas.json")
	loadFixture(t, dynamic_segments, "testdata/dynamic_segments.json")

	// Profiles
	t.Run("CreateProfile", testAudienceService_CreateProfile)
	t.Run("DeleteProfile", testAudienceService_DeleteProfile)
	t.Run("UpdateProfile", testAudienceService_UpdateProfile)
	t.Run("UpdateProfile_ms12", testAudienceService_UpdateProfile_ms12)
	t.Run("UpdateProfileIdentifier", testAudienceService_UpdateProfileIdentifier)
	t.Run("GetProfile", testAudienceService_GetProfile)
	t.Run("GetProfileByDeviceId", testAudienceService_GetProfileByDeviceId)
	t.Run("GetProfileByIdentifier", testAudienceService_GetProfileByIdentifier)

	t.Run("ListProfilesByIds", testAudienceService_ListProfilesByIds)
	t.Run("ListProfilesByIdentifiers", testAudienceService_ListProfilesByIdentifiers)

	// Profile Schema
	t.Run("GetProfileSchema", testAudienceService_GetProfilesSchema)

	// Devices
	t.Run("GetDeviceSchema", testAudienceService_GetDeviceSchema)
	t.Run("GetDevice", testAudienceService_GetDevice)
	t.Run("GetDeviceByPushToken", testAudienceService_GetDeviceByPushToken)
	t.Run("CreateDevice", testAudienceService_CreateDevice)
	t.Run("CreateDevice_ms12", testAudienceService_CreateDevice_Ms12)
	t.Run("UpdateDevice", testAudienceService_UpdateDevice)
	t.Run("UpdateDevicePushToken", testAudienceService_UpdateDevicePushToken)
	t.Run("UpdateDeviceUnregisterPushToken", testAudienceService_UpdateDeviceUnregisterPushToken)
	t.Run("UpdateDeviceLocation", testAudienceService_UpdateDeviceLocation)
	t.Run("UpdateDeviceGeofenceMonitoring", testAudienceService_UpdateDeviceGeofenceMonitoring)
	t.Run("UpdateDeviceIBeaconMonitoring", testAudienceService_UpdateDeviceIBeaconMonitoring)
	t.Run("UpdateDeviceTestProperty", testAudienceService_UpdateDeviceTestProperty)
	t.Run("UpdateDeviceCustomAttributes", testAudienceService_UpdateDeviceCustomAttributes)
	t.Run("UpdateDeviceCustomAttributes_ms12", testAudienceService_UpdateDeviceCustomAttributes_ms12)

	t.Run("SetDeviceProfile", testAudienceService_SetDeviceProfile)
	t.Run("SetDeviceProfile_ms12", testAudienceService_SetDeviceProfile_ms12)

	t.Run("DeleteDevice", testAudienceService_DeleteDevice)
	t.Run("ListDevicesByProfileId", testAudienceService_ListDevicesByProfileId)
	t.Run("ListDevicesByProfileIdentifier", testAudienceService_ListDevicesByProfileIdentifier)
	t.Run("ListDevicesByProfileIdentifier_ms12", testAudienceService_ListDevicesByProfileIdentifier_ms12)

	t.Run("GetDeviceSchema", testAudienceService_GetDeviceSchema)

	// Dynamic Segments
	t.Run("CreateDynamicSegment", testAudienceService_CreateDynamicSegment)
	t.Run("GetDynamicSegmentById", testAudienceService_GetDynamicSegmentById)

	t.Run("UpdateDynamicSegmentTitle", testAudienceService_UpdateDynamicSegmentTitle)
	t.Run("UpdateDynamicSegmentArchiveStatus", testAudienceService_UpdateDynamicSegmentArchiveStatus)
	t.Run("UpdateDynamicSegmentPredicates", testAudienceService_UpdateDynamicSegmentPredicates)

	t.Run("ListDynamicSegments", testAudienceService_ListDynamicSegments)

	t.Run("EnsureNotifications", testAudienceServiceNotifications)

	// Predicate Checks
	t.Run("IsInDynamicSegment", testAudienceService_IsInDynamicSegment)
	t.Run("DeviceIsInDynamicSegment", testAudienceService_DeviceIsInDynamicSegment)

	// NOTE: must run last
	t.Run("EnsureIndexes", func(t *testing.T) {
		var (
			res []bson.M
			Q   = bson.M{
				"op":          bson.M{"$in": []string{"query", "update", "remove"}},
				"planSummary": bson.M{"$nin": []bson.RegEx{{Pattern: `IXSCAN`}, {Pattern: `IDHACK`}}},
				"ns":          bson.M{"$nin": []bson.RegEx{{Pattern: `system.profile`}}},
			}
		)

		if err := system_profile.Find(Q).All(&res); err != nil {
			t.Error("system.profile:", err)
		}

		if len(res) > 0 {
			data, err := json.MarshalIndent(res, " ", "  ")
			if err != nil {
				t.Errorf("unexpected:%v", err)
			}

			t.Errorf("non-optimized queries:%s", data)
		}
	})

}

func testAudienceService_CreateProfile(t *testing.T) {
	var (
		ctx      = context.TODO()
		objectId = tNewObjectIdFunc(t, 0)

		createdAt = parseTime(t, "2016-11-11T00:00:00.111Z")
		timeNow   = func() time.Time { return createdAt }

		db = mongodb.New(dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(objectId),
			mongodb.WithTimeFunc(timeNow),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string

		req *audience.CreateProfileRequest

		exp    *audience.CreateProfileResponse
		expErr error
	}{
		{
			name: "error: requires account id to be set",

			expErr: grpc.Errorf(codes.Unauthenticated, "AuthContext: must be set"),

			req: &audience.CreateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 0},
			},
		},
		{
			name: "creates an empty profile",

			req: &audience.CreateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
			},

			exp: &audience.CreateProfileResponse{
				&audience.Profile{
					Id:         "0194fdc2fa2ffcc041d3ff12",
					AccountId:  1,
					Attributes: nil,
					Identifier: "",
					CreatedAt:  protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
				},
			},
		},
		// This test passes but breaks TestAudienceService/EnsureNotifications
		//{
		//	name: "creates an empty identified profile",
		//
		//	req: &audience.CreateProfileRequest{
		//		AuthContext: &auth.AuthContext{AccountId: 1},
		//		Identifier:  "abc",
		//	},
		//
		//	exp: &audience.CreateProfileResponse{
		//		&audience.Profile{
		//			Id:         "045b73c86e4ff95ff662a5ee",
		//			AccountId:  1,
		//			Attributes: nil,
		//			Identifier: "abc",
		//			CreatedAt:  protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
		//			UpdatedAt:  protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
		//		},
		//	},
		//},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.CreateProfile(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}

}

func testAudienceService_DeleteProfile(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.DeleteProfileRequest

		expErr        error
		before, after *expect
	}{
		{
			name: "error: invalid id",

			expErr: grpc.Errorf(codes.InvalidArgument, "db.DeleteProfile: StringToObjectID: bson.IsObjectIdHex: false"),

			req: &audience.DeleteProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "notreallyavalidid",
			},
		},
		{
			name: "error: deleting non-existing profile",

			expErr: grpc.Errorf(codes.NotFound, "db.DeleteProfile: profiles.Remove: not found"),

			req: &audience.DeleteProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "000000000000000000000000",
			},
		},

		{
			name: "deletes profile",

			req: &audience.DeleteProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "0194fdc2fa2ffcc041d3ff12",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "0194fdc2fa2ffcc041d3ff12",
					AccountId:  1,
					Attributes: nil,
					Identifier: "",

					CreatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2016-11-11T00:00:00.111Z")),
				},
			},

			after: &expect{
				expErr: errors.Wrap(errors.New("not found"), "profiles.FindId"),
				exp:    nil,
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.DeleteProfile(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateProfileIdentifier(t *testing.T) {
	var (
		ctx = context.TODO()

		createdAt = parseTime(t, "2016-08-22T19:05:53.102Z")
		updatedAt = time.Now().Truncate(time.Millisecond)

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name      string
		req       *audience.UpdateProfileIdentifierRequest
		schemaReq *audience.GetProfileSchemaRequest

		expErr error

		before, after *expect
	}{
		{
			// TODO:
			name: "error: profile id: blank",

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: ProfileId: blank"),

			req: &audience.UpdateProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "",
			},
		},
		{
			name: "error: profile: not found",

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateProfileIdentifier: profiles.Update: not found"),

			req: &audience.UpdateProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "000000000000000000000000",
			},
		},

		{
			name: "error: duplicate: identifier",

			expErr: grpc.Errorf(codes.AlreadyExists, `db.UpdateProfileIdentifier: profiles.Update: E11000 duplicate key error collection: audience_service_test.profiles index: account_id_1_identifier_1 dup key: { : 1.0, : "a12abbc1-8935-407a-bf81-3f77abaff9d0" }`),

			req: &audience.UpdateProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "000000000000000000000a00",

				Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
			},
		},

		{
			name: "updates profile identifier",

			req: &audience.UpdateProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				ProfileId:   "000000000000000000000aa0",

				Identifier: "22222222-2222-2222-2222-222222222222",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "000000000000000000000aa0",
					AccountId:  5,
					Identifier: "11111111-1111-1111-1111-111111111111",

					CreatedAt: protoTs(t, createdAt),
					UpdatedAt: protoTs(t, createdAt),
				},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:         "000000000000000000000aa0",
					AccountId:  5,
					Identifier: "22222222-2222-2222-2222-222222222222",

					CreatedAt: protoTs(t, createdAt),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateProfileIdentifier(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateProfile(t *testing.T) {
	var (
		ctx = context.TODO()

		// TODO: updatedAt should be actually updated
		updatedAt = parseTime(t, "2016-08-22T19:05:53.102Z")
		aTime     = protoTs(t, updatedAt)

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type expect struct {
		expErr         error
		exp, expSchema interface{}
	}

	tcases := []struct {
		name      string
		req       *audience.UpdateProfileRequest
		schemaReq *audience.GetProfileSchemaRequest

		expErr error

		before, after *expect
	}{
		{
			name: "error: profile id: blank",

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: ProfileId: blank"),

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "",
			},
		},
		{
			name: "error: profile: not found",

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateProfile: profiles.Find: not found"),

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				ProfileId: "000000000000000000000000",
			},
		},

		{
			name: "errors: validation: tags attribute",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"tags": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: tags: IsStringArray: TypeMismatch"),
		},

		{
			name: "updates profile: no updates: same",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaaaa",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:  5,
					Identifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"string":    audience.StringVal("hello"),
						"timestamp": audience.TimestampVal(*protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z"))),
						"array":     audience.StringArrayVal("hello", "world"),
						"bool":      audience.BoolVal(true),
						"integer":   audience.DoubleVal(1),
						"double":    audience.DoubleVal(3.1415),
					},
				},

				expSchema: &audience.ProfileSchema{},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:  5,
					Identifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",
					CreatedAt:  aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"string":    audience.StringVal("hello"),
						"timestamp": audience.TimestampVal(*protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z"))),
						"array":     audience.StringArrayVal("hello", "world"),
						"bool":      audience.BoolVal(true),
						"integer":   audience.DoubleVal(1),
						"double":    audience.DoubleVal(3.1415),
					},
				},

				expSchema: &audience.ProfileSchema{},
			},
		},
		{
			name: "updates profile: bools",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa00",
				Attributes: map[string]*audience.ValueUpdates{
					"bool-set-true": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
					"bool-set-false": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaa00",
					AccountId:  5,
					Identifier: "78e19dbf-8c0b-47a5-b28f-333333333333",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool": audience.BoolVal(false),
					},
				},

				expSchema: &audience.ProfileSchema{},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:        "aaaaaaaaaaaaaaaaaaaaaa00",
					AccountId: 5,

					CreatedAt: aTime, UpdatedAt: aTime,
					Identifier: "78e19dbf-8c0b-47a5-b28f-333333333333",

					Attributes: map[string]*audience.Value{
						"bool-set-false": audience.BoolVal(false),
						"bool-set-true":  audience.BoolVal(true),
						"bool":           audience.BoolVal(false),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{AccountId: 5,
							Id:            "0194fdc2fa2ffcc041d3ff12",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{AccountId: 5,
							Id:            "045b73c86e4ff95ff662a5ee",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates profile: uppercase attribute names",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "bbaaaaaaaaaaaaaaaaaaaa00",
				Attributes: map[string]*audience.ValueUpdates{
					"Last Name": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Mouse")},
					}},
					"Last_Name": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Moose")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "bbaaaaaaaaaaaaaaaaaaaa00",
					AccountId:  1,
					Identifier: "bbaaaaaaaaaaaaaaaaaaaa00",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"Last_Name": audience.StringVal("bob"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     1,
							Id:            "59ed69400000000000000000",
							Attribute:     "Last Name",
							Label:         "Last Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:         "bbaaaaaaaaaaaaaaaaaaaa00",
					AccountId:  1,
					Identifier: "bbaaaaaaaaaaaaaaaaaaaa00",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"Last Name": audience.StringVal("Mouse"),
						"Last_Name": audience.StringVal("Moose"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     1,
							Id:            "59ed69400000000000000000",
							Attribute:     "Last Name",
							Label:         "Last Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
						{
							AccountId:     1,
							Id:            "e82abdf44a2d0b75fb180daf",
							Attribute:     "Last_Name",
							Label:         "Last_Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates profile: arrays",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa01",

				Attributes: map[string]*audience.ValueUpdates{
					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello")},
					}},
					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},
					"arr-remove": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					}},
					// rpc error: code = Internal desc = db.UpdateProfile: UpdateProfileAttributes: profiles.UpdateId: Cannot update 'attributes.arr-add-remove' and 'attributes.arr-add-remove' at the same time
					// "arr-add-remove": {Values: []*audience.ValueUpdate{
					// 	{audience.ValueUpdate_ADD, audience.StringVal("adds")},
					// 	{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					// }},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaa01",
					AccountId:  5,
					Identifier: "78e19dbf-8c0b-47a5-b28f-444444444444",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"arr":            audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds"),
						"arr-remove":     audience.StringArrayVal("keeps", "removes"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{AccountId: 5,
							Id:            "0194fdc2fa2ffcc041d3ff12",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{AccountId: 5,
							Id:            "045b73c86e4ff95ff662a5ee",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
					},
				},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaa01",
					AccountId:  5,
					Identifier: "78e19dbf-8c0b-47a5-b28f-444444444444",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"arr":            audience.StringArrayVal("hello"),
						"arr-set":        audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds", "added"),
						"arr-remove":     audience.StringArrayVal("keeps"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     5,
							Id:            "0194fdc2fa2ffcc041d3ff12",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     5,
							Id:            "045b73c86e4ff95ff662a5ee",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     5,
							Id:            "0875d64ee2d3d0d0de6bf8f9",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     5,
							Id:            "48a79ee0b10d394651850fd4",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     5,
							Id:            "a178892ee285ece151145578",
							Attribute:     "arr-remove",
							Label:         "arr-remove",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates profile: multiple updates",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 6},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaaff",
				Attributes: map[string]*audience.ValueUpdates{
					"bool-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},

					"string-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Maryan")},
					}},

					"integer-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},

					"double-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.DoubleVal(31415e-4)},
					}},

					"null-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},

					"ts-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.TimestampVal(*aTime)},
					}},

					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello", "world")},
					}},

					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},

					"arr-remove": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaaff",
					AccountId:  6,
					Identifier: "78e19dbf-8c0b-47a5-b28f-555555555555",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":           audience.BoolVal(true),
						"string":         audience.StringVal("hello world"),
						"integer":        audience.IntegerVal(42),
						"double":         audience.DoubleVal(42.42),
						"null":           audience.NullVal,
						"ts":             audience.TimestampVal(*aTime),
						"arr":            audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds"),
						"arr-remove":     audience.StringArrayVal("keeps", "removes"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: nil,
				},
			},

			after: &expect{
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaaff",
					AccountId:  6,
					Identifier: "78e19dbf-8c0b-47a5-b28f-555555555555",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":     audience.BoolVal(true),
						"bool-set": audience.BoolVal(false),

						"string":     audience.StringVal("hello world"),
						"string-set": audience.StringVal("Maryan"),

						"integer":     audience.IntegerVal(42),
						"integer-set": audience.IntegerVal(1),

						"double":     audience.DoubleVal(42.42),
						"double-set": audience.DoubleVal(31415e-4),

						"null":     audience.NullVal,
						"null-set": audience.NullVal,

						"ts":     audience.TimestampVal(*aTime),
						"ts-set": audience.TimestampVal(*aTime),

						"arr":            audience.StringArrayVal("hello"),
						"arr-set":        audience.StringArrayVal("hello", "world"),
						"arr-add":        audience.StringArrayVal("adds", "added"),
						"arr-remove":     audience.StringArrayVal("keeps"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						0: {
							AccountId:     6,
							Id:            "0dcecc77c75e7a81bfde275f",
							Attribute:     "bool-set",
							Label:         "bool-set",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						1: {
							AccountId:     6,
							Id:            "32f3a8aeb79ef856f659c18f",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						2: {
							AccountId:     6,
							Id:            "3bbf857aab99c5b252c7429c",
							Attribute:     "arr-remove",
							Label:         "arr-remove",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						3: {
							AccountId:     6,
							Id:            "67cfe242cf3cc354f3ede2d6",
							Attribute:     "double-set",
							Label:         "double-set",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						4: {
							AccountId:     6,
							Id:            "8bcb9ef2d4a65314768d6d29",
							Attribute:     "string-set",
							Label:         "string-set",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
						5: {
							AccountId:     6,
							Id:            "9761ea9e4f5aa6aec3fc78c6",
							Attribute:     "ts-set",
							Label:         "ts-set",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						6: {
							AccountId:     6,
							Id:            "b44ce85ff044c6b1f83b8e88",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						7: {
							AccountId:     6,
							Id:            "becc4ea3ae5e88526a9f4a57",
							Attribute:     "integer-set",
							Label:         "integer-set",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "error: schema validation: bool",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"bool": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaa20",
					AccountId:  20,
					Identifier: "78e19dbf-8c0b-47a5-b28f-666666666666",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":    audience.BoolVal(true),
						"integer": audience.IntegerVal(42),
						"double":  audience.DoubleVal(42.42),
						"string":  audience.StringVal("a string"),
						"arr":     audience.StringArrayVal("hello", "world"),
						"ts":      audience.TimestampVal(*aTime),
						"null":    audience.NullVal,
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{AccountId: 20,
							Id:            "000000000000000000000f20",
							Attribute:     "bool",
							Label:         "bool",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{AccountId: 20,
							Id:            "000000000000000000000f21",
							Attribute:     "integer",
							Label:         "integer",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
						{AccountId: 20,
							Id:            "000000000000000000000f22",
							Attribute:     "double",
							Label:         "double",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						{AccountId: 20,
							Id:            "000000000000000000000f23",
							Attribute:     "ts",
							Label:         "ts",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						{AccountId: 20,
							Id:            "000000000000000000000f24",
							Attribute:     "arr",
							Label:         "arr",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{AccountId: 20,
							Id:            "000000000000000000000f25",
							Attribute:     "string",
							Label:         "string",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "error: schema validation: integer",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"integer": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: timestamp",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"ts": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: string",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"string": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: array",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: double",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateProfile: SchemaValidation: TypeMismatch"),
		},

		{
			name: "schema validation: null",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"null": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: nil,
		},

		{
			name: "null'em all",
			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 20},
				ProfileId:   "aaaaaaaaaaaaaaaaaaaaaa20",
				Attributes: map[string]*audience.ValueUpdates{
					"null": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"bool": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"integer": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"double": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"ts": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"string": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
				},
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Profile{
					Id:         "aaaaaaaaaaaaaaaaaaaaaa20",
					AccountId:  20,
					Identifier: "78e19dbf-8c0b-47a5-b28f-666666666666",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":    audience.NullVal,
						"integer": audience.NullVal,
						"double":  audience.NullVal,
						"string":  audience.NullVal,
						"arr":     audience.NullVal,
						"ts":      audience.NullVal,
						"null":    audience.NullVal,
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}

				{
					exp, expErr := tc.before.expSchema, (error)(nil)
					got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("Before:Schema:\n%v", difff(diff))
					}
				}
			}

			var _, gotErr = client.UpdateProfile(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}

				if tc.after.expSchema != nil {
					exp, expErr := tc.after.expSchema, (error)(nil)
					got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("After:Schema\n%v", difff(diff))
					}
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceCustomAttributes(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = parseTime(t, "2016-08-22T19:05:53.102Z")
		aTime     = protoTs(t, updatedAt)

		_ = aTime

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 8)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type expect struct {
		expErr         error
		exp, expSchema interface{}
	}

	tcases := []struct {
		name      string
		req       *audience.UpdateDeviceCustomAttributesRequest
		schemaReq *audience.GetDeviceSchemaResponse

		expErr error

		before, after *expect
	}{
		{
			name: "error: device id: blank",

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "",
			},
		},

		{
			name: "error: device: not found",

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceCustomAttributes: devices.Find: not found"),

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 8},

				DeviceId: "100000000000000000000000",
			},
		},

		{
			name: "errors: validation: tags attribute",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 8},
				DeviceId:    "aaaaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"tags": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: tags: IsStringArray: TypeMismatch"),
		},

		{
			name: "updates device: no updates: same",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 8},
				DeviceId:    "1aaaaaaaaaaaaaaaaaaaaaaa",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "1aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":    audience.BoolVal(true),
						"integer": audience.IntegerVal(42),
						"double":  audience.DoubleVal(3.1415),
						"string":  audience.StringVal("hello world"),
						"ts":      audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-30T14:05:53.102Z"))),
						"arr":     audience.StringArrayVal("hello", "world"),
						"null":    audience.NullVal,
					},
				},

				expSchema: &audience.DeviceSchema{},
			},

			after: &expect{
				exp: &audience.Device{
					Id:                "1aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":    audience.BoolVal(true),
						"integer": audience.IntegerVal(42),
						"double":  audience.DoubleVal(3.1415),
						"string":  audience.StringVal("hello world"),
						"ts":      audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-30T14:05:53.102Z"))),
						"arr":     audience.StringArrayVal("hello", "world"),
						"null":    audience.NullVal,
					},
				},

				expSchema: &audience.DeviceSchema{},
			},
		},

		{
			name: "updates device: bools",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 8},
				DeviceId:    "2aaaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"bool-set-true": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
					"bool-set-false": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "2aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "2aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool": audience.BoolVal(true),
					},
				},

				expSchema: &audience.DeviceSchema{},
			},

			after: &expect{
				exp: &audience.Device{
					Id:                "2aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "2aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool-set-false": audience.BoolVal(false),
						"bool-set-true":  audience.BoolVal(true),
						"bool":           audience.BoolVal(true),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{AccountId: 8,
							Id:            "5079832da0a39e4f1cd6fdfc",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{AccountId: 8,
							Id:            "633c0fa6d58f41c06e609c10",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates device: string: uppercase attribute names",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 9},
				DeviceId:    "3aaaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"Last Name": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Mouse")},
					}},
					"Last_Name": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Moose")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "3aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         9,
					DeviceId:          "3aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "3aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"Last_Name": audience.StringVal("bob"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     9,
							Id:            "59ed69400000000000000000",
							Attribute:     "Last Name",
							Label:         "Last Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},

			after: &expect{
				exp: &audience.Device{
					Id:                "3aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         9,
					DeviceId:          "3aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "3aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"Last Name": audience.StringVal("Mouse"),
						"Last_Name": audience.StringVal("Moose"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     9,
							Id:            "54e40bab03aeed1a6c42a5b4",
							Attribute:     "Last_Name",
							Label:         "Last_Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
						{
							AccountId:     9,
							Id:            "59ed69400000000000000000",
							Attribute:     "Last Name",
							Label:         "Last Name",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates device: arrays",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 8},
				DeviceId:    "4aaaaaaaaaaaaaaaaaaaaaaa",

				Attributes: map[string]*audience.ValueUpdates{
					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello")},
					}},
					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},
					"arr-remove": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					}},
					// rpc error: code = Internal desc = db.UpdateProfile: UpdateProfileAttributes: profiles.UpdateId: Cannot update 'attributes.arr-add-remove' and 'attributes.arr-add-remove' at the same time
					// "arr-add-remove": {Values: []*audience.ValueUpdate{
					// 	{audience.ValueUpdate_ADD, audience.StringVal("adds")},
					// 	{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					// }},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "4aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "4aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"arr":            audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds"),
						"arr-remove":     audience.StringArrayVal("keeps", "removes"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     8,
							Id:            "5079832da0a39e4f1cd6fdfc",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     8,
							Id:            "633c0fa6d58f41c06e609c10",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
					},
				},
			},

			after: &expect{
				exp: &audience.Device{
					Id:                "4aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         8,
					DeviceId:          "4aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "1aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"arr":            audience.StringArrayVal("hello"),
						"arr-set":        audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds", "added"),
						"arr-remove":     audience.StringArrayVal("keeps"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     8,
							Id:            "078998d0bbaa2890d02c28b1",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     8,
							Id:            "24ae38421a8457d894a5593b",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     8,
							Id:            "5079832da0a39e4f1cd6fdfc",
							Attribute:     "bool-set-false",
							Label:         "bool-set-false",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     8,
							Id:            "633c0fa6d58f41c06e609c10",
							Attribute:     "bool-set-true",
							Label:         "bool-set-true",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     8,
							Id:            "d1da7f90fa45603d51ff78d8",
							Attribute:     "arr-remove",
							Label:         "arr-remove",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "updates device: multiple updates",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 11},
				DeviceId:    "5aaaaaaaaaaaaaaaaaaaaaaa",

				Attributes: map[string]*audience.ValueUpdates{
					"bool-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},

					"string-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Maryan")},
					}},

					"integer-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},

					"double-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.DoubleVal(31415e-4)},
					}},

					"null-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},

					"ts-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.TimestampVal(*aTime)},
					}},

					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello", "world")},
					}},

					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},

					"arr-remove": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "5aaaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "5aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         11,
					ProfileId:         "5aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":           audience.BoolVal(true),
						"string":         audience.StringVal("hello world"),
						"integer":        audience.IntegerVal(42),
						"double":         audience.DoubleVal(42.42),
						"null":           audience.NullVal,
						"ts":             audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z"))),
						"arr":            audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds"),
						"arr-remove":     audience.StringArrayVal("keeps", "removes"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: nil,
				},
			},

			after: &expect{
				exp: &audience.Device{
					Id:                "5aaaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         11,
					DeviceId:          "5aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "5aaaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "78e19dbf-8c0b-47a5-b28f-4f1650feccf6",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":     audience.BoolVal(true),
						"bool-set": audience.BoolVal(false),

						"string":     audience.StringVal("hello world"),
						"string-set": audience.StringVal("Maryan"),

						"integer":     audience.IntegerVal(42),
						"integer-set": audience.IntegerVal(1),

						"double":     audience.DoubleVal(42.42),
						"double-set": audience.DoubleVal(31415e-4),

						"null":     audience.NullVal,
						"null-set": audience.NullVal,

						"ts":     audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z"))),
						"ts-set": audience.TimestampVal(*aTime),

						"arr":            audience.StringArrayVal("hello"),
						"arr-set":        audience.StringArrayVal("hello", "world"),
						"arr-add":        audience.StringArrayVal("adds", "added"),
						"arr-remove":     audience.StringArrayVal("keeps"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     11,
							Id:            "3f2c5e3962106a33388f8147",
							Attribute:     "integer-set",
							Label:         "integer-set",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "4f17818a5d5af14a8b452513",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "539716581fe9a6373add13bc",
							Attribute:     "double-set",
							Label:         "double-set",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "58ec76ecbc343c7b29929f40",
							Attribute:     "arr-remove",
							Label:         "arr-remove",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "70599f2976bffa10e6ef87e4",
							Attribute:     "ts-set",
							Label:         "ts-set",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "7bcb212775664518ccc46306",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "b5d751885f470b2fe8219c89",
							Attribute:     "bool-set",
							Label:         "bool-set",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     11,
							Id:            "f5a13a3727760e5274ad4e6d",
							Attribute:     "string-set",
							Label:         "string-set",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "error: schema validation: bool",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",

				Attributes: map[string]*audience.ValueUpdates{
					"bool": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:         12,
					Id:                "12aaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "12aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "12aaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "12aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":    audience.BoolVal(true),
						"integer": audience.IntegerVal(42),
						"double":  audience.DoubleVal(42.42),
						"string":  audience.StringVal("hello world"),
						"arr":     audience.StringArrayVal("hello", "world"),
						"ts":      audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z"))),
						"null":    audience.NullVal,
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{AccountId: 12,
							Id:            "000000000000000000000f20",
							Attribute:     "bool",
							Label:         "bool",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{AccountId: 12,
							Id:            "000000000000000000000f21",
							Attribute:     "integer",
							Label:         "integer",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
						{AccountId: 12,
							Id:            "000000000000000000000f22",
							Attribute:     "double",
							Label:         "double",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						{AccountId: 12,
							Id:            "000000000000000000000f23",
							Attribute:     "ts",
							Label:         "ts",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						{AccountId: 12,
							Id:            "000000000000000000000f24",
							Attribute:     "arr",
							Label:         "arr",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{AccountId: 12,
							Id:            "000000000000000000000f25",
							Attribute:     "string",
							Label:         "string",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},

		{
			name: "error: schema validation: integer",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"integer": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: timestamp",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"ts": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: string",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"string": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),
		},
		//
		{
			name: "error: schema validation: array",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",

				Attributes: map[string]*audience.ValueUpdates{
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),
		},

		{
			name: "error: schema validation: double",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.UpdateDeviceCustomAttributes: SchemaValidation: TypeMismatch"),
		},

		{
			name: "schema validation: null",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"null": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(true)},
					}},
				},
			},

			expErr: nil,
		},

		{
			name: "null'em all",
			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 12},
				DeviceId:    "12aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"null": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"arr": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"bool": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"integer": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"double": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"ts": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
					"string": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},
				},
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "12aaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         12,
					ProfileIdentifier: "12aaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "12aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "12aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":    audience.NullVal,
						"integer": audience.NullVal,
						"double":  audience.NullVal,
						"string":  audience.NullVal,
						"arr":     audience.NullVal,
						"ts":      audience.NullVal,
						"null":    audience.NullVal,
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}

				{
					exp, expErr := tc.before.expSchema, (error)(nil)
					got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("Before:Schema:\n%v", difff(diff))
					}
				}
			}

			var _, gotErr = client.UpdateDeviceCustomAttributes(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}

				if tc.after.expSchema != nil {
					exp, expErr := tc.after.expSchema, (error)(nil)
					got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("After:Schema\n%v", difff(diff))
					}
				}
			}
		})
	}
}

// ms-12: tests that device attributes and schema also get copied to the profile
// TODO: remove once migration is done
func testAudienceService_UpdateDeviceCustomAttributes_ms12(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = parseTime(t, "2017-10-30T14:05:53.102Z")
		aTime     = protoTs(t, updatedAt)

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 13)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type expect struct {
		expErr    error
		exp       interface{}
		expSchema *audience.DeviceSchema
	}

	tcases := []struct {
		name      string
		req       *audience.UpdateDeviceCustomAttributesRequest
		schemaReq *audience.GetDeviceSchemaRequest

		expErr error

		before, after *expect
	}{
		{
			name: "updates profile & device attributes",

			req: &audience.UpdateDeviceCustomAttributesRequest{
				AuthContext: &auth.AuthContext{AccountId: 13},
				DeviceId:    "13aaaaaaaaaaaaaaaaaaaaaa",
				Attributes: map[string]*audience.ValueUpdates{
					"bool-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},

					"string-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Maryan")},
					}},

					"integer-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},

					"double-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.DoubleVal(31415e-4)},
					}},

					"null-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},

					"ts-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.TimestampVal(*aTime)},
					}},

					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello", "world")},
					}},

					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:         13,
					Id:                "13aaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "13aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "13aaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "13aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":    audience.BoolVal(true),
						"integer": audience.IntegerVal(42),
						"double":  audience.DoubleVal(42.42),
						"string":  audience.StringVal("hello world"),
						"arr":     audience.StringArrayVal("hello"),
						"ts":      audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z"))),
						"null":    audience.NullVal,
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: nil,
				},
			},

			after: &expect{
				exp: &audience.Device{
					AccountId:         13,
					Id:                "13aaaaaaaaaaaaaaaaaaaaaa",
					ProfileIdentifier: "13aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "13aaaaaaaaaaaaaaaaaaaaaa",
					ProfileId:         "13aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),

					Attributes: map[string]*audience.Value{
						"bool":     audience.BoolVal(true),
						"bool-set": audience.BoolVal(false),

						"string":     audience.StringVal("hello world"),
						"string-set": audience.StringVal("Maryan"),

						"integer":     audience.IntegerVal(42),
						"integer-set": audience.IntegerVal(1),

						"double":     audience.DoubleVal(42.42),
						"double-set": audience.DoubleVal(31415e-4),

						"null":     audience.NullVal,
						"null-set": audience.NullVal,

						"ts":     audience.TimestampVal(*protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z"))),
						"ts-set": audience.TimestampVal(*aTime),

						"arr":     audience.StringArrayVal("hello"),
						"arr-set": audience.StringArrayVal("hello", "world"),
						"arr-add": audience.StringArrayVal("added"),
					},
				},

				expSchema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     13,
							Id:            "1407bf28e80aebf04cf75781",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "2428b0763112efb33b6f4fad",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "388e83b42296ba1412acec2f",
							Attribute:     "string-set",
							Label:         "string-set",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "7a43d41fa5385d9754040908",
							Attribute:     "double-set",
							Label:         "double-set",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "7deb445e54d8cac4061761a9",
							Attribute:     "bool-set",
							Label:         "bool-set",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "c9a0c0f71a1e479a49f3773c",
							Attribute:     "ts-set",
							Label:         "ts-set",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						{
							AccountId:     13,
							Id:            "cb95aaec3927e88d053271d3",
							Attribute:     "integer-set",
							Label:         "integer-set",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Fatalf("Before:\n%v", difff(diff))
				}

				{
					profile, gotErr := db.FindProfileById(ctx, got.ProfileId)
					if diff := Diff(got.Attributes, profile.Attributes, nil, gotErr); diff != nil {
						t.Fatalf("Before:Attributes[%s]:\n%v", profile.Id, difff(diff))
					}
				}

				{
					exp, expErr := tc.before.expSchema, (error)(nil)
					got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Fatalf("Before:Schema:\n%v", difff(diff))
					}

					{
						got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
						if diff := Diff(exp.Attributes, got.Attributes, expErr, gotErr); diff != nil {
							t.Fatalf("Before:ProfileSchema:\n%v", difff(diff))
						}
					}
				}
			}

			var _, gotErr = client.UpdateDeviceCustomAttributes(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Fatalf("After:\n%v", difff(diff))
				}

				{
					profile, gotErr := db.FindProfileById(ctx, got.ProfileId)

					if diff := Diff(got.Attributes, profile.Attributes, nil, gotErr); diff != nil {
						t.Fatalf("After:Attributes[%s]:\n%v", profile.Id, difff(diff))
					}
				}

				{
					exp, expErr := tc.after.expSchema, (error)(nil)
					got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Fatalf("After:Schema:\n%v", difff(diff))
					}

					{
						got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
						if diff := Diff(exp.Attributes, got.Attributes, expErr, gotErr); diff != nil {
							t.Fatalf("After:ProfileSchema:\n%v", difff(diff))
						}
					}
				}
			}
		})
	}
}

func testAudienceService_CreateDevice_Ms12(t *testing.T) {
	var (
		ctx = context.TODO()

		createdAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 5)),
			mongodb.WithTimeFunc(func() time.Time { return createdAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.CreateDeviceRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: profile_id: set",
			req: &audience.CreateDeviceRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 21},

				DeviceId:  "0000",
				ProfileId: "invalid",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: ProfileId: deprecated"),
		},

		{
			name: "error: device id: invalid",
			req: &audience.CreateDeviceRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 21},

				DeviceId:  "",
				ProfileId: "000000000000000000000aa2",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},

		{
			name: "creates device with anonymous profile",
			req: &audience.CreateDeviceRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 21},
				ProfileIdentifier: "",
				DeviceId:          "CCCCCCCC-0000-0000-0000-000000000001",
			},

			expErr: nil,

			before: &expect{
				expErr: errors.Wrap(errors.New("not found"), "devices.FindId"),
				exp:    nil,
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:        "e282fad85af699815c18c595",
					AccountId: 21,
					DeviceId:  "CCCCCCCC-0000-0000-0000-000000000001",
					ProfileId: "c00913e02a63e4cf532d9b2c",
					CreatedAt: protoTs(t, createdAt),
					UpdatedAt: protoTs(t, createdAt),

					ProfileIdentifier: "",
				},
			},
		},

		{
			name: "creates device with identified profile",
			req: &audience.CreateDeviceRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 21},

				DeviceId:          "CCCCCCCC-0000-0000-0000-000000000002",
				ProfileIdentifier: "helloworld",
			},

			expErr: nil,

			before: &expect{
				expErr: errors.Wrap(errors.New("not found"), "devices.FindId"),
				exp:    nil,
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					CreatedAt:         protoTs(t, createdAt),
					UpdatedAt:         protoTs(t, createdAt),
					Id:                "28c43daa5aa248d5a17dde49",
					AccountId:         21,
					DeviceId:          "CCCCCCCC-0000-0000-0000-000000000002",
					ProfileId:         "ea804462a794f75123135cc7",
					ProfileIdentifier: "helloworld",
				},
			},
		},

		{
			name: "creates device and reuses existing profile",
			req: &audience.CreateDeviceRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 21},

				DeviceId:          "CCCCCCCC-0000-0000-0000-000000000003",
				ProfileIdentifier: "helloworld",
			},

			expErr: nil,

			before: &expect{
				expErr: errors.Wrap(errors.New("not found"), "devices.FindId"),
				exp:    nil,
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					CreatedAt:         protoTs(t, createdAt),
					UpdatedAt:         protoTs(t, createdAt),
					Id:                "06843049a995cbd0b80d2369",
					AccountId:         21,
					DeviceId:          "CCCCCCCC-0000-0000-0000-000000000003",
					ProfileId:         "ea804462a794f75123135cc7",
					ProfileIdentifier: "helloworld",
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.CreateDevice(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}

				if d, ok := tc.after.exp.(*audience.Device); ok && d != nil {
					_, gotErr := db.FindProfileById(ctx, d.ProfileId)

					if diff := Diff(nil, nil, nil, gotErr); diff != nil {
						t.Errorf("After:FindProfileById\n%v", difff(diff))
					}
				}
			}
		})
	}
}

// ms-12: tests that profile attributes and schema also get copied to all the devices
// TODO: remove once migration is done
func testAudienceService_UpdateProfile_ms12(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = parseTime(t, "2017-10-30T14:05:53.102Z")
		aTime     = protoTs(t, updatedAt)

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 1)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type expect struct {
		expErr    error
		exp       interface{}
		expSchema *audience.ProfileSchema
	}

	tcases := []struct {
		name      string
		req       *audience.UpdateProfileRequest
		schemaReq *audience.GetProfileSchemaRequest

		expErr error

		before, after *expect
	}{
		{
			name: "updates profile & device attributes",

			req: &audience.UpdateProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 7},
				ProfileId:   "aaa000000000000000000000",
				Attributes: map[string]*audience.ValueUpdates{
					"bool-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.BoolVal(false)},
					}},

					"string-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringVal("Maryan")},
					}},

					"integer-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.IntegerVal(1)},
					}},

					"double-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.DoubleVal(31415e-4)},
					}},

					"null-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.NullVal},
					}},

					"ts-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.TimestampVal(*aTime)},
					}},

					"arr-set": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_SET, audience.StringArrayVal("hello", "world")},
					}},

					"arr-add": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_ADD, audience.StringVal("added")},
					}},

					"arr-remove": {Values: []*audience.ValueUpdate{
						{audience.ValueUpdate_REMOVE, audience.StringVal("removes")},
					}},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Profile{
					AccountId:  7,
					Id:         "aaa000000000000000000000",
					Identifier: "profilewithdevices",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":           audience.BoolVal(true),
						"string":         audience.StringVal("hello world"),
						"integer":        audience.IntegerVal(42),
						"double":         audience.DoubleVal(42.42),
						"null":           audience.NullVal,
						"ts":             audience.TimestampVal(*aTime),
						"arr":            audience.StringArrayVal("hello"),
						"arr-add":        audience.StringArrayVal("adds"),
						"arr-remove":     audience.StringArrayVal("keeps", "removes"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: nil,
				},
			},

			after: &expect{
				exp: &audience.Profile{
					AccountId:  7,
					Id:         "aaa000000000000000000000",
					Identifier: "profilewithdevices",

					CreatedAt: aTime, UpdatedAt: aTime,

					Attributes: map[string]*audience.Value{
						"bool":     audience.BoolVal(true),
						"bool-set": audience.BoolVal(false),

						"string":     audience.StringVal("hello world"),
						"string-set": audience.StringVal("Maryan"),

						"integer":     audience.IntegerVal(42),
						"integer-set": audience.IntegerVal(1),

						"double":     audience.DoubleVal(42.42),
						"double-set": audience.DoubleVal(31415e-4),

						"null":     audience.NullVal,
						"null-set": audience.NullVal,

						"ts":     audience.TimestampVal(*aTime),
						"ts-set": audience.TimestampVal(*aTime),

						"arr":            audience.StringArrayVal("hello"),
						"arr-set":        audience.StringArrayVal("hello", "world"),
						"arr-add":        audience.StringArrayVal("adds", "added"),
						"arr-remove":     audience.StringArrayVal("keeps"),
						"arr-add-remove": audience.StringArrayVal("adds", "removes"),
					},
				},

				expSchema: &audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							AccountId:     7,
							Id:            "367951baa2ff6cd471c483f1",
							Attribute:     "ts-set",
							Label:         "ts-set",
							AttributeType: "timestamp",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "487f6999eb9d18a44784045d",
							Attribute:     "integer-set",
							Label:         "integer-set",
							AttributeType: "integer",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "52fdfc072182654f163f5f0f",
							Attribute:     "arr-add",
							Label:         "arr-add",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "6694d2c422acd208a0072939",
							Attribute:     "double-set",
							Label:         "double-set",
							AttributeType: "double",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "681d0d86d1e91e00167939cb",
							Attribute:     "bool-set",
							Label:         "bool-set",
							AttributeType: "bool",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "7bbb0407d1e2c64981855ad8",
							Attribute:     "arr-set",
							Label:         "arr-set",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "87f3c67cf22746e995af5a25",
							Attribute:     "string-set",
							Label:         "string-set",
							AttributeType: "string",
							CreatedAt:     aTime,
						},
						{
							AccountId:     7,
							Id:            "9a621d729566c74d10037c4d",
							Attribute:     "arr-remove",
							Label:         "arr-remove",
							AttributeType: "array[string]",
							CreatedAt:     aTime,
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}

				{ // every device has to have same attributes as profile
					devices, gotErr := db.ListDevicesByProfileId(ctx, &audience.ListDevicesByProfileIdRequest{
						ProfileId:   tc.req.ProfileId,
						AuthContext: tc.req.AuthContext,
					})

					if diff := Diff(nil, nil, nil, gotErr); diff != nil {
						t.Errorf("Before:ListDevices:\n%v", difff(diff))
					}

					if len(devices) == 0 {
						t.Errorf("%v", devices)
						t.Fatalf("Before: profile must have devices")
					}

					for _, d := range devices {
						if diff := Diff(got.Attributes, d.Attributes, nil, nil); diff != nil {
							t.Errorf("Before:CopyDiff[%s]:\n%v", d.DeviceId, difff(diff))
						}
					}
				}

				{
					exp, expErr := tc.before.expSchema, (error)(nil)
					got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("Before:Schema:\n%v", difff(diff))
					}

					{
						got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
						if diff := Diff(exp.Attributes, got.Attributes, expErr, gotErr); diff != nil {
							t.Errorf("Before:Schema:\n%v", difff(diff))
						}
					}
				}
			}

			var _, gotErr = client.UpdateProfile(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindProfileById(ctx, tc.req.GetProfileId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}

				{ // every device has to have same attributes as profile
					devices, gotErr := db.ListDevicesByProfileId(ctx, &audience.ListDevicesByProfileIdRequest{
						ProfileId:   tc.req.ProfileId,
						AuthContext: tc.req.AuthContext,
					})
					if diff := Diff(nil, nil, nil, gotErr); diff != nil {
						t.Errorf("After:ListDevices:\n%v", difff(diff))
					}

					for _, d := range devices {
						if diff := Diff(got.Attributes, d.Attributes, nil, nil); diff != nil {
							t.Errorf("Before:CopyDiff[%s]:\n%v", d.DeviceId, difff(diff))
						}
					}
				}

				if tc.after.expSchema != nil {
					exp, expErr := tc.after.expSchema, (error)(nil)
					got, gotErr := db.GetProfileSchema(ctx, &audience.GetProfileSchemaRequest{tc.req.AuthContext})
					if diff := Diff(exp, got, expErr, gotErr); diff != nil {
						t.Errorf("After:Schema\n%v", difff(diff))
					}

					{
						got, gotErr := db.GetDeviceSchemaByAccountId(ctx, int(tc.req.AuthContext.AccountId))
						if diff := Diff(exp.Attributes, got.Attributes, expErr, gotErr); diff != nil {
							t.Errorf("Before:Schema:\n%v", difff(diff))
						}
					}
				}
			}
		})
	}
}

func testAudienceService_GetProfileByDeviceId(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetProfileByDeviceIdRequest

		exp    *audience.GetProfileByDeviceIdResponse
		expErr error
	}{
		{
			name: "error: not found: no such device",

			expErr: grpc.Errorf(codes.NotFound, "db.GetProfileByDeviceId: devices.Find: not found"),

			req: &audience.GetProfileByDeviceIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId: "000000000000000000000000",
			},
		},
		{
			name: "finds profile by device id",

			req: &audience.GetProfileByDeviceIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId: "D00000000000000000000002",
			},

			exp: &audience.GetProfileByDeviceIdResponse{
				&audience.Profile{AccountId: 1,

					Id:         "d00000000000000000000002",
					Identifier: "hello",
					Attributes: nil,
					CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			var got, gotErr = client.GetProfileByDeviceId(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetProfile(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetProfileRequest

		exp    *audience.GetProfileResponse
		expErr error
	}{
		{
			name: "error: not found ",

			expErr: grpc.Errorf(codes.NotFound, "db.GetProfile: profiles.Find: not found"),

			req: &audience.GetProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "000000000000000000000000",
			},
		},

		{
			name: "error: invalid: profile id",

			expErr: grpc.Errorf(codes.InvalidArgument, "db.GetProfile: StringToObjectID: bson.IsObjectIdHex: false"),

			req: &audience.GetProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "invalidid",
			},
		},

		{
			name: "finds profile",

			req: &audience.GetProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "000000000000000000000aa2",
			},

			exp: &audience.GetProfileResponse{
				&audience.Profile{
					AccountId: 1,

					Id:         "000000000000000000000aa2",
					Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
					Attributes: nil,
					CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			var got, gotErr = client.GetProfile(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetProfileByIdentifier(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetProfileByIdentifierRequest

		expErr error
		exp    *audience.GetProfileByIdentifierResponse
	}{
		{
			name: "error: not found: no such identifier",

			expErr: grpc.Errorf(codes.NotFound, "db.GetProfileByIdentifier: profiles.Find: not found"),

			req: &audience.GetProfileByIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				Identifier: "000000000000000000000000",
			},
		},
		{
			name: "error: not found: wrong account",

			expErr: grpc.Errorf(codes.NotFound, "db.GetProfileByIdentifier: profiles.Find: not found"),

			req: &audience.GetProfileByIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},

				Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
			},
		},

		{
			name: "finds profile",

			req: &audience.GetProfileByIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
			},

			exp: &audience.GetProfileByIdentifierResponse{
				&audience.Profile{
					AccountId: 1,

					Id:         "000000000000000000000aa2",
					Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
					Attributes: nil,
					CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			got, gotErr := client.GetProfileByIdentifier(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_ListProfilesByIds(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.ListProfilesByIdsRequest

		exp    *audience.ListProfilesByIdsResponse
		expErr error
	}{
		{
			name: "error: invalid profile id",

			req: &audience.ListProfilesByIdsRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				ProfileIds: []string{
					"hello world",
				},
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.ListProfilesByIds: StringToObjectID: bson.IsObjectIdHex: false"),
		},
		{
			name: "no profiles in account",

			req: &audience.ListProfilesByIdsRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				ProfileIds: []string{
					"000000000000000000000aa0",
					"000000000000000000000aa2",
				},
			},

			exp: &audience.ListProfilesByIdsResponse{
				Profiles: nil,
			},
		},
		{
			name: "lists profiles",

			req: &audience.ListProfilesByIdsRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileIds: []string{
					"000000000000000000000aa2",
					"000000000000000000000aa1",
				},
			},

			exp: &audience.ListProfilesByIdsResponse{
				Profiles: []*audience.Profile{
					{
						AccountId: 1,

						Id:         "000000000000000000000aa1",
						Identifier: "a12abbc1-8935-407a-bf81-111111111111",
						Attributes: nil,
						CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					},
					{
						AccountId: 1,

						Id:         "000000000000000000000aa2",
						Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
						Attributes: nil,
						CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			got, gotErr := client.ListProfilesByIds(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_ListProfilesByIdentifiers(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.ListProfilesByIdentifiersRequest

		exp    *audience.ListProfilesByIdentifiersResponse
		expErr error
	}{
		{
			name: "no profiles in account",

			req: &audience.ListProfilesByIdentifiersRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				ProfileIdentifiers: []string{
					"zzzz",
					"xxxx",
				},
			},

			exp: &audience.ListProfilesByIdentifiersResponse{
				Profiles: nil,
			},
		},
		{
			name: "lists profiles",

			req: &audience.ListProfilesByIdentifiersRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileIdentifiers: []string{
					"a12abbc1-8935-407a-bf81-111111111111",
					"a12abbc1-8935-407a-bf81-3f77abaff9d0",
				},
			},

			exp: &audience.ListProfilesByIdentifiersResponse{
				Profiles: []*audience.Profile{
					{
						AccountId: 1,

						Id:         "000000000000000000000aa1",
						Identifier: "a12abbc1-8935-407a-bf81-111111111111",
						Attributes: nil,
						CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					},
					{
						AccountId: 1,

						Id:         "000000000000000000000aa2",
						Identifier: "a12abbc1-8935-407a-bf81-3f77abaff9d0",
						Attributes: nil,
						CreatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						UpdatedAt:  protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			got, gotErr := client.ListProfilesByIdentifiers(ctx, tc.req)

			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetProfilesSchema(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc              = service.New(db, new(nopIndex), logNotifier(t))
		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetProfileSchemaRequest

		exp    *audience.GetProfileSchemaResponse
		expErr error
	}{
		{
			name: "no schema",
			req: &audience.GetProfileSchemaRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 0,
				},
			},

			exp: &audience.GetProfileSchemaResponse{
				&audience.ProfileSchema{
					Attributes: nil,
				},
			},
		},
		{
			name: "a schema",
			req: &audience.GetProfileSchemaRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
			},

			exp: &audience.GetProfileSchemaResponse{
				&audience.ProfileSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							Id:            "000000000000000000000f02",
							AccountId:     100,
							Attribute:     "name",
							Label:         "name",
							AttributeType: "string",
							CreatedAt:     protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						},
						{
							Id:            "000000000000000000000f03",
							AccountId:     100,
							Attribute:     "created_at",
							Label:         "created_at",
							AttributeType: "timestamp",
							CreatedAt:     protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.GetProfileSchema(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_SetDeviceProfile(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.SetDeviceProfileRequest

		expErr error

		before, after *expect
	}{
		{
			name: "error: invalid profile_id",
			req: &audience.SetDeviceProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "invalid",
				ProfileId:   "invalid",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceProfileIdById: devices.FindId: not found"),
		},

		{
			name: "error: device_id: blank",
			req: &audience.SetDeviceProfileRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 1,
				},
				DeviceId:  "",
				ProfileId: "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},

		{
			name: "error: not found: profile",
			req: &audience.SetDeviceProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "000000000000000000000000",
				ProfileId:   "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceProfileIdById: devices.FindId: not found"),
		},

		{
			name: "sets profile",
			req: &audience.SetDeviceProfileRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "D00000000000000000000000",
				ProfileId:   "000000000000000000000aa1",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:        "0000000000000000000000d0",
					DeviceId:  "D00000000000000000000000",
					AccountId: 1,
					ProfileId: "000000000000000000000aa2",

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "0000000000000000000000d0",
					DeviceId:          "D00000000000000000000000",
					AccountId:         1,
					ProfileId:         "000000000000000000000aa1",
					ProfileIdentifier: "a12abbc1-8935-407a-bf81-111111111111",

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			_, gotErr := client.SetDeviceProfile(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_SetDeviceProfile_ms12(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.SetDeviceProfileRequest

		expErr error

		before, after *expect
	}{
		{
			name: "error: device_id: blank",
			req: &audience.SetDeviceProfileRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 14},
				DeviceId:    "",
				ProfileId:   "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},

		{
			name: "error: profile_id: is set",
			req: &audience.SetDeviceProfileRequest{
				Ms12:        true,
				AuthContext: &auth.AuthContext{AccountId: 14},
				DeviceId:    "000000000000000000000000",
				ProfileId:   "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: ProfileId: deprecated"),
		},

		{
			name: "updates device: profile_identifier: empty",
			req: &audience.SetDeviceProfileRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 14},
				DeviceId:          "14aaaaaaaaaaaaaaaaaaaaaa",
				ProfileIdentifier: "",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "14aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "14aaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         14,
					ProfileId:         "000000000000000000000000",
					ProfileIdentifier: "14aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "14aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "14aaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         14,
					ProfileId:         "0194fdc2fa2ffcc041d3ff12",
					ProfileIdentifier: "",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},

		{
			name: "updates device: profile_identifier: is set",
			req: &audience.SetDeviceProfileRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 14},
				DeviceId:          "15aaaaaaaaaaaaaaaaaaaaaa",
				ProfileIdentifier: "155555555555555555555555",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "15aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "15aaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         14,
					ProfileId:         "0194fdc2fa2ffcc041d3ff12",
					ProfileIdentifier: "15aaaaaaaaaaaaaaaaaaaaaa",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "15aaaaaaaaaaaaaaaaaaaaaa",
					DeviceId:          "15aaaaaaaaaaaaaaaaaaaaaa",
					AccountId:         14,
					ProfileId:         "045b73c86e4ff95ff662a5ee",
					ProfileIdentifier: "155555555555555555555555",

					CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {

			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			_, gotErr := client.SetDeviceProfile(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_GetDevice(t *testing.T) {
	var (
		ctx = context.TODO()

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
		)
		svc = service.New(db, new(nopIndex), logNotifier(t))

		createdAt = protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z"))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetDeviceRequest

		exp    *audience.GetDeviceResponse
		expErr error
	}{
		{
			name: "error: validation: blank id",
			req: &audience.GetDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},
		{
			name: "error: not found",
			req: &audience.GetDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "0000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDevice: devices.Find: not found"),
		},

		{
			name: "error: account: foreign",
			req: &audience.GetDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "adevice00",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDevice: devices.Find: not found"),
		},

		{
			name: "finds device",
			req: &audience.GetDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "adevice00",
			},

			expErr: nil,

			exp: &audience.GetDeviceResponse{
				&audience.Device{
					Id:        "59713dbd4dd7a7932aa66453",
					DeviceId:  "adevice00",
					AccountId: 1,
					ProfileId: "00000000000000000000aaa2",

					CreatedAt: createdAt,
					UpdatedAt: createdAt,

					AppBuild:           "23",
					AppName:            "Air Miles",
					AppNamespace:       "com.airmiles",
					AppVersion:         "1.0",
					CarrierName:        "rogers",
					DeviceManufacturer: "Apple",

					PushTokenKey:       "abc",
					PushTokenIsActive:  true,
					PushTokenCreatedAt: createdAt,
					PushTokenUpdatedAt: createdAt,
					PushEnvironment:    "development",

					Frameworks: map[string]*audience.Version{
						"RoverEvents": {Major: 1, Minor: 2, Revision: 2},
						"RoverPush":   {Major: 1, Minor: 0, Revision: 3},
					},
					IsCellularEnabled: true,
					IsWifiEnabled:     true,
					LocaleLanguage:    "en",
					LocaleRegion:      "us",
					LocaleScript:      "zz",
					DeviceModel:       "iPhone 6",
					OsName:            "iOS",
					OsVersion:         &audience.Version{1, 2, 3},
					Radio:             "LTE",
					ScreenHeight:      720,
					ScreenWidth:       1080,
					TimeZone:          "America/Toronto",
					Platform:          audience.Platform_WEB,

					IsBackgroundEnabled:         true,
					IsBluetoothEnabled:          true,
					IsLocationMonitoringEnabled: true,

					LocationAccuracy:  65,
					LocationLatitude:  22.00101,
					LocationLongitude: -32.1231,
					LocationCountry:   "Canada",
					LocationState:     "Ontario",
					LocationCity:      "Toronto",
					LocationUpdatedAt: createdAt,

					RegionMonitoringMode: audience.Device_GIMBAL,

					IbeaconMonitoringRegionsUpdatedAt: createdAt,
					IbeaconMonitoringRegions: []*audience.IBeaconRegion{
						{"1h1h1", 1, 2},
						{"0001", 3, 4},
					},

					GeofenceMonitoringRegionsUpdatedAt: createdAt,
					GeofenceMonitoringRegions: []*audience.GeofenceRegion{
						{
							Id:       "37.331701:-122.030847:50",
							Latitude: 37.331701, Longitude: -122.030847,
							Radius: 50,
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			got, gotErr := client.GetDevice(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetDeviceByPushToken(t *testing.T) {
	var (
		ctx = context.TODO()

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
		)
		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetDeviceByPushTokenRequest

		exp    *audience.GetDeviceByPushTokenResponse
		expErr error
	}{
		{
			name: "error: validation: blank id",
			req: &audience.GetDeviceByPushTokenRequest{
				AuthContext:  &auth.AuthContext{AccountId: 0},
				PushTokenKey: "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: PushTokenKey: blank"),
		},

		{
			name: "error: not found",
			req: &audience.GetDeviceByPushTokenRequest{
				AuthContext:  &auth.AuthContext{AccountId: 1},
				PushTokenKey: "doesntexists",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceByPushToken: devices.Find: not found"),
		},

		{
			name: "error: account: invalid",
			req: &audience.GetDeviceByPushTokenRequest{
				AuthContext:  &auth.AuthContext{AccountId: 100},
				PushTokenKey: "token:bbbbbbbbbbbbbbbbbbbbbbbb",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceByPushToken: devices.Find: not found"),
		},

		{
			name: "finds device",
			req: &audience.GetDeviceByPushTokenRequest{
				AuthContext:  &auth.AuthContext{AccountId: 1},
				PushTokenKey: "token:bbbbbbbbbbbbbbbbbbbbbbbb",
			},

			expErr: nil,

			exp: &audience.GetDeviceByPushTokenResponse{
				&audience.Device{
					Id:        "bbbbbbbbbbbbbbbbbbbbbbbb",
					DeviceId:  "BBBBBBBB",
					AccountId: 1,
					ProfileId: "bbbbbbbbbbbbbbbbbbbbbbbb",

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),

					PushTokenKey:       "token:bbbbbbbbbbbbbbbbbbbbbbbb",
					PushTokenIsActive:  true,
					PushTokenCreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					PushTokenUpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			got, gotErr := client.GetDeviceByPushToken(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_CreateDevice(t *testing.T) {
	var (
		ctx = context.TODO()

		createdAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return createdAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.CreateDeviceRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: profile_id: unset",
			req: &audience.CreateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId:  "0000",
				ProfileId: "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.CreateDevice: StringToObjectID: ProfileId: bson.IsObjectIdHex: false"),
		},

		{
			name: "error: profile_id: invalid",
			req: &audience.CreateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId:  "0000",
				ProfileId: "zer0",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "db.CreateDevice: StringToObjectID: ProfileId: bson.IsObjectIdHex: false"),
		},

		{
			name: "error: profile_id: doesn't exist",
			req: &audience.CreateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId:  "0000",
				ProfileId: "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.CreateDevice: profiles.Find: not found"),
		},

		{
			name: "error: device id: invalid",
			req: &audience.CreateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId:  "",
				ProfileId: "000000000000000000000aa2",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},

		{
			name: "creates device",
			req: &audience.CreateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},

				DeviceId:  "DDDDDDDD-0000-0000-0000-000000000001",
				ProfileId: "dddddddddddddddddddddddd",
			},

			expErr: nil,

			before: &expect{
				expErr: errors.Wrap(errors.New("not found"), "devices.FindId"),
				exp:    nil,
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:                "0194fdc2fa2ffcc041d3ff12",
					AccountId:         1,
					DeviceId:          "DDDDDDDD-0000-0000-0000-000000000001",
					ProfileId:         "dddddddddddddddddddddddd",
					CreatedAt:         protoTs(t, createdAt),
					UpdatedAt:         protoTs(t, createdAt),
					ProfileIdentifier: "11111111-1111-1111-1111-dddddddddddd",
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.CreateDevice(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDevice(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: profile_id: unset",
			req: &audience.UpdateDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDevice: devices.Find: not found"),
		},

		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 100,
				},

				DeviceId: "00000000-0000-0000-0000-000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDevice: devices.Find: not found"),
		},

		{
			name: "updates device",
			req: &audience.UpdateDeviceRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 5,
				},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1",

				AppName:            "rover",
				PushEnvironment:    "development",
				PushTokenKey:       "000000000000000000000000000000000000000000",
				AppVersion:         "1.0",
				AppBuild:           "52",
				AppNamespace:       "io.rover",
				DeviceManufacturer: "Apple",
				OsName:             "iOS",
				OsVersion:          &audience.Version{1, 0, 0},
				DeviceModel:        "iPhone 6",
				Frameworks: map[string]*audience.Version{
					"io.rover.Rover":     &audience.Version{1, 2, 3},
					"io.rover.RoverPush": &audience.Version{1, 2, 3},
				},
				LocaleLanguage:              "en",
				LocaleRegion:                "us",
				LocaleScript:                "",
				IsWifiEnabled:               true,
				IsCellularEnabled:           false,
				ScreenWidth:                 1024,
				ScreenHeight:                768,
				CarrierName:                 "Rogers",
				Radio:                       "LTE",
				TimeZone:                    "America/Toronto",
				Platform:                    audience.Platform_WEB,
				IsBackgroundEnabled:         true,
				IsLocationMonitoringEnabled: true,
				IsBluetoothEnabled:          true,
				AdvertisingId:               "123hello",
				Ip:                          "1.2.3.4",
				NotificationAuthorization: audience.NotificationAuthorization_DENIED,

				RegionMonitoringMode: audience.Device_GIMBAL,
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:                 5,
					Id:                        "000000000000000000000dd1",
					DeviceId:                  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1",
					ProfileId:                 "000000000000000000000ad1",
					NotificationAuthorization: audience.NotificationAuthorization_UNKNOWN,
					CreatedAt:                 protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt:                 protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:       "000000000000000000000dd1",
					DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1",

					AccountId: 5,
					ProfileId: "000000000000000000000ad1",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:       "000000000000000000000000000000000000000000",
					PushTokenIsActive:  true,
					PushTokenUpdatedAt: protoTs(t, updatedAt),
					PushTokenCreatedAt: protoTs(t, updatedAt),

					AppName:            "rover",
					PushEnvironment:    "development",
					AppVersion:         "1.0",
					AppBuild:           "52",
					AppNamespace:       "io.rover",
					DeviceManufacturer: "Apple",
					OsName:             "iOS",
					OsVersion:          &audience.Version{1, 0, 0},
					DeviceModel:        "iPhone 6",
					Frameworks: map[string]*audience.Version{
						"io.rover.Rover":     &audience.Version{1, 2, 3},
						"io.rover.RoverPush": &audience.Version{1, 2, 3},
					},
					LocaleLanguage:              "en",
					LocaleRegion:                "us",
					LocaleScript:                "",
					IsWifiEnabled:               true,
					IsCellularEnabled:           false,
					ScreenWidth:                 1024,
					ScreenHeight:                768,
					CarrierName:                 "Rogers",
					Radio:                       "LTE",
					TimeZone:                    "America/Toronto",
					Platform:                    audience.Platform_WEB,
					IsBackgroundEnabled:         true,
					IsLocationMonitoringEnabled: true,
					IsBluetoothEnabled:          true,
					AdvertisingId:               "123hello",
					Ip:                          "1.2.3.4",
					NotificationAuthorization: audience.NotificationAuthorization_DENIED,

					RegionMonitoringMode: audience.Device_GIMBAL,
				},
			},
		},
		{
			name: "updates device: push token: deactivation",
			req: &audience.UpdateDeviceRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 5,
				},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1",

				PushTokenKey: "",

				AppName:            "rover",
				PushEnvironment:    "development",
				AppVersion:         "1.0",
				AppBuild:           "52",
				AppNamespace:       "io.rover",
				DeviceManufacturer: "Apple",
				OsName:             "iOS",
				OsVersion:          &audience.Version{1, 0, 0},
				DeviceModel:        "iPhone 6",
				Frameworks: map[string]*audience.Version{
					"RoverEvents": &audience.Version{1, 2, 3},
					"RoverPush":   &audience.Version{1, 2, 3},
				},
				LocaleLanguage:              "en",
				LocaleRegion:                "us",
				LocaleScript:                "",
				IsWifiEnabled:               true,
				IsCellularEnabled:           false,
				ScreenWidth:                 1024,
				ScreenHeight:                768,
				CarrierName:                 "Rogers",
				Radio:                       "LTE",
				TimeZone:                    "America/Toronto",
				Platform:                    audience.Platform_WEB,
				IsBackgroundEnabled:         true,
				IsLocationMonitoringEnabled: true,
				IsBluetoothEnabled:          true,
				AdvertisingId:               "123hello",
				Ip:                          "1.2.3.4",
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd1",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD1",
					ProfileId: "000000000000000000000ad1",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "",
					PushTokenCreatedAt:      protoTs(t, updatedAt),
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenUnregisteredAt: protoTs(t, updatedAt),
					PushTokenIsActive:       false,

					AppName:            "rover",
					PushEnvironment:    "development",
					AppVersion:         "1.0",
					AppBuild:           "52",
					AppNamespace:       "io.rover",
					DeviceManufacturer: "Apple",
					OsName:             "iOS",
					OsVersion:          &audience.Version{1, 0, 0},
					DeviceModel:        "iPhone 6",
					Frameworks: map[string]*audience.Version{
						"RoverEvents": &audience.Version{1, 2, 3},
						"RoverPush":   &audience.Version{1, 2, 3},
					},
					LocaleLanguage:              "en",
					LocaleRegion:                "us",
					LocaleScript:                "",
					IsWifiEnabled:               true,
					IsCellularEnabled:           false,
					ScreenWidth:                 1024,
					ScreenHeight:                768,
					CarrierName:                 "Rogers",
					Radio:                       "LTE",
					TimeZone:                    "America/Toronto",
					Platform:                    audience.Platform_WEB,
					IsBackgroundEnabled:         true,
					IsLocationMonitoringEnabled: true,
					IsBluetoothEnabled:          true,
					AdvertisingId:               "123hello",
					Ip:                          "1.2.3.4",
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDevice(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceTestProperty(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceTestPropertyRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: device_id: unset",
			req: &audience.UpdateDeviceTestPropertyRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				DeviceId:    "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceTestProperty: devices.Update: not found"),
		},

		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceTestPropertyRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "000000000000000000000dd4",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceTestProperty: devices.Update: not found"),
		},

		{
			name: "updates device",
			req: &audience.UpdateDeviceTestPropertyRequest{
				AuthContext:  &auth.AuthContext{AccountId: 5},
				DeviceId:     "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
				IsTestDevice: true,
			},

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:    5,
					IsTestDevice: false,

					Id:        "000000000000000000000dd7",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
					ProfileId: "000000000000000000000ad6",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:    5,
					IsTestDevice: true,

					Id:        "000000000000000000000dd7",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
					ProfileId: "000000000000000000000ad6",

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},

		{
			name: "updates device toggles back",
			req: &audience.UpdateDeviceTestPropertyRequest{
				AuthContext:  &auth.AuthContext{AccountId: 5},
				DeviceId:     "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
				IsTestDevice: false,
			},

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:    5,
					IsTestDevice: true,

					Id:        "000000000000000000000dd7",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
					ProfileId: "000000000000000000000ad6",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId:    5,
					IsTestDevice: false,

					Id:        "000000000000000000000dd7",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD7",
					ProfileId: "000000000000000000000ad6",

					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {

				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDeviceTestProperty(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDevicePushToken(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDevicePushTokenRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{

		{
			name: "error: wrong account",
			req: &audience.UpdateDevicePushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDevicePushToken: devices.Find: not found"),
		},

		{
			name: "updates device push token",
			req: &audience.UpdateDevicePushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},

				DeviceId:     "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
				PushTokenKey: "1234567890",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd3",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
					ProfileId: "000000000000000000000ad3",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd3",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
					ProfileId: "000000000000000000000ad3",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "1234567890",
					PushTokenIsActive:       true,
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenCreatedAt:      protoTs(t, updatedAt),
					PushTokenUnregisteredAt: nil,
				},
			},
		},

		{
			name: "updates device: push token: deactivation",
			req: &audience.UpdateDevicePushTokenRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 5,
				},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",

				PushTokenKey: "",
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd3",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
					ProfileId: "000000000000000000000ad3",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "",
					PushTokenCreatedAt:      protoTs(t, updatedAt),
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenUnregisteredAt: protoTs(t, updatedAt),
					PushTokenIsActive:       false,
				},
			},
		},

		{
			name: "updates device: push token: reactivation",
			req: &audience.UpdateDevicePushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				DeviceId:    "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",

				PushTokenKey: "0123456789",
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd3",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
					ProfileId: "000000000000000000000ad3",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "0123456789",
					PushTokenCreatedAt:      protoTs(t, updatedAt),
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenUnregisteredAt: nil,
					PushTokenIsActive:       true,
				},
			},
		},

		{
			name: "updates device: push token: update",
			req: &audience.UpdateDevicePushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				DeviceId:    "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",

				PushTokenKey: "0123456789abcdef",
			},

			expErr: nil,

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd3",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD3",
					ProfileId: "000000000000000000000ad3",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "0123456789abcdef",
					PushTokenCreatedAt:      protoTs(t, updatedAt),
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenIsActive:       true,
					PushTokenUnregisteredAt: nil,
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDevicePushToken(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceUnregisterPushToken(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceUnregisterPushTokenRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{

		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceUnregisterPushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceUnregisterPushToken: devices.Update: not found"),
		},

		{
			name: "unregisters device push token",
			req: &audience.UpdateDeviceUnregisterPushTokenRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-000000000000",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "dddddddddddddddddddddddd",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-000000000000",
					ProfileId: "000000000000000000000bbb",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),

					PushTokenKey:            "registered",
					PushTokenIsActive:       true,
					PushTokenUpdatedAt:      protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					PushTokenCreatedAt:      protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					PushTokenUnregisteredAt: nil,
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "dddddddddddddddddddddddd",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-000000000000",
					ProfileId: "000000000000000000000bbb",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					PushTokenKey:            "registered",
					PushTokenIsActive:       false,
					PushTokenCreatedAt:      protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					PushTokenUpdatedAt:      protoTs(t, updatedAt),
					PushTokenUnregisteredAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDeviceUnregisterPushToken(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceLocation(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceLocationRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{

		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceLocationRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceLocation: devices.Update: not found"),
		},

		{
			name: "updates device location",
			req: &audience.UpdateDeviceLocationRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD4",

				LocationAccuracy:  65,
				LocationLatitude:  22.00101,
				LocationLongitude: -32.1231,
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{

					AccountId: 5,
					Id:        "000000000000000000000dd4",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD4",
					ProfileId: "000000000000000000000ad4",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd4",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD4",
					ProfileId: "000000000000000000000ad4",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					LocationAccuracy:  65,
					LocationLatitude:  22.00101,
					LocationLongitude: -32.1231,
					LocationUpdatedAt: protoTs(t, updatedAt),
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDeviceLocation(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceGeofenceMonitoring(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceGeofenceMonitoringRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{

		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceGeofenceMonitoringRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceGeofenceMonitoring: devices.Update: not found"),
		},

		{
			name: "updates regions",
			req: &audience.UpdateDeviceGeofenceMonitoringRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD5",

				Regions: []*audience.GeofenceRegion{
					{Id: "37.331701:-122.030847:50",
						Latitude: 37.331701, Longitude: -122.030847,
						Radius: 50,
					},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd5",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD5",
					ProfileId: "000000000000000000000ad5",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd5",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD5",
					ProfileId: "000000000000000000000ad5",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					GeofenceMonitoringRegionsUpdatedAt: protoTs(t, updatedAt),
					GeofenceMonitoringRegions: []*audience.GeofenceRegion{
						{Id: "37.331701:-122.030847:50",
							Latitude: 37.331701, Longitude: -122.030847,
							Radius: 50,
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDeviceGeofenceMonitoring(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_UpdateDeviceIBeaconMonitoring(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(
			mdb,
			mongodb.WithTimeFunc(func() time.Time { return updatedAt }),
		)

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.UpdateDeviceIBeaconMonitoringRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: device: not found",
			req: &audience.UpdateDeviceIBeaconMonitoringRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceIBeaconMonitoring: devices.Update: not found"),
		},
		{
			name: "error: wrong account",
			req: &audience.UpdateDeviceIBeaconMonitoringRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},
			expErr: grpc.Errorf(codes.NotFound, "db.UpdateDeviceIBeaconMonitoring: devices.Update: not found"),
		},

		{
			name: "updates device location",
			req: &audience.UpdateDeviceIBeaconMonitoringRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},

				DeviceId: "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD6",

				Regions: []*audience.IBeaconRegion{
					{Uuid: "UUID", Major: 1, Minor: 2},
				},
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd6",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD6",
					ProfileId: "000000000000000000000ad6",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: nil,
				exp: &audience.Device{
					AccountId: 5,
					Id:        "000000000000000000000dd6",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDD6",
					ProfileId: "000000000000000000000ad6",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, updatedAt),

					IbeaconMonitoringRegionsUpdatedAt: protoTs(t, updatedAt),
					IbeaconMonitoringRegions: []*audience.IBeaconRegion{
						{Uuid: "UUID", Major: 1, Minor: 2},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.UpdateDeviceIBeaconMonitoring(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.after.exp, got, tc.after.expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_DeleteDevice(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(dialMongo(t, *tMongoDSN))

		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	type tCase struct {
		name string
		req  *audience.DeleteDeviceRequest

		expErr error

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "error: device id: unset",
			req: &audience.DeleteDeviceRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 1,
				},
				DeviceId: "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: DeviceId: blank"),
		},

		{
			name: "error: device: not found",
			req: &audience.DeleteDeviceRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 1,
				},
				DeviceId: "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceProfileIdById: devices.FindId: not found"),
		},

		{
			name: "error: existing device but different account",
			req: &audience.DeleteDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				DeviceId:    "00000000-0000-0000-0000-000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.GetDeviceProfileIdById: devices.FindId: not found"),
		},

		{
			name: "deletes device",
			req: &audience.DeleteDeviceRequest{
				AuthContext: &auth.AuthContext{AccountId: 5},
				DeviceId:    "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp: &audience.Device{
					Id:        "000000000000000000000ddd",
					DeviceId:  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD",
					AccountId: 5,
					ProfileId: "000000000000000000000add",
					CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.497Z")),
				},
			},

			after: &expect{
				expErr: errors.Wrap(errors.New("not found"), "devices.FindId"),
				exp:    nil,
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				if diff := Diff(tc.before.exp, got, tc.before.expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = client.DeleteDevice(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				got, gotErr := db.FindDeviceById(ctx, tc.req.GetDeviceId())
				exp, expErr := tc.after.exp, tc.after.expErr
				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func testAudienceService_ListDevicesByProfileId(t *testing.T) {
	var (
		ctx = context.TODO()
		// createdAt = protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z"))

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(mdb,
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
		)
		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.ListDevicesByProfileIdRequest

		exp    *audience.ListDevicesByProfileIdResponse
		expErr error
	}{
		{
			name: "error: validation: blank id",
			req: &audience.ListDevicesByProfileIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: ProfileId: blank"),
		},
		{
			name: "error: not found: profile",
			req: &audience.ListDevicesByProfileIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "000000000000000000000000",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.ListDevicesByProfileId: profileExists: not found"),
		},

		{
			name: "profiles with no devices",
			req: &audience.ListDevicesByProfileIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "d0000000000000000000000d",
			},

			expErr: nil,
			exp:    &audience.ListDevicesByProfileIdResponse{nil},
		},

		{
			name: "wrong account",
			req: &audience.ListDevicesByProfileIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				ProfileId:   "000000000000000000000bb2",
			},

			expErr: nil,
			exp:    &audience.ListDevicesByProfileIdResponse{nil},
		},

		{
			name: "finds devices",
			req: &audience.ListDevicesByProfileIdRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				ProfileId:   "000000000000000000000bb2",
			},

			expErr: nil,

			exp: &audience.ListDevicesByProfileIdResponse{
				[]*audience.Device{
					{
						AccountId: 1,
						Id:        "d00000000000000000000bb0",
						DeviceId:  "d-bb0",
						ProfileId: "000000000000000000000bb2",
						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					},
					{
						AccountId: 1,
						Id:        "d00000000000000000000bb2",
						DeviceId:  "d-bb2",
						ProfileId: "000000000000000000000bb2",
						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			got, gotErr := client.ListDevicesByProfileId(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_ListDevicesByProfileIdentifier(t *testing.T) {
	var (
		ctx = context.TODO()
		// createdAt = protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z"))

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(mdb,
			mongodb.WithLogger(log.NewLog(log.Debug)),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
		)
		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.ListDevicesByProfileIdentifierRequest

		exp    *audience.ListDevicesByProfileIdentifierResponse
		expErr error
	}{
		{
			name: "error: validation: blank id",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Identifier:  "",
			},

			expErr: grpc.Errorf(codes.InvalidArgument, "Validation: Identifier: blank"),
		},
		{
			name: "error: not found: profile",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Identifier:  "00000000-0000-0000-0000-000000000zzz",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.ListDevicesByProfileIdentifier: profiles.Find: not found"),
		},

		{
			name: "profiles with no devices",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Identifier:  "11111111-1111-1111-1111-222222222222",
			},

			expErr: nil,
			exp:    &audience.ListDevicesByProfileIdentifierResponse{nil},
		},

		{
			name: "wrong account",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 100},
				Identifier:  "00000000-0000-0000-0000-000000000bb2",
			},

			expErr: grpc.Errorf(codes.NotFound, "db.ListDevicesByProfileIdentifier: profiles.Find: not found"),
		},

		{
			name: "finds devices",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Identifier:  "00000000-0000-0000-0000-000000000bb2",
			},

			expErr: nil,

			exp: &audience.ListDevicesByProfileIdentifierResponse{
				[]*audience.Device{
					{
						AccountId: 1,
						Id:        "d00000000000000000000bb0",
						DeviceId:  "d-bb0",
						ProfileId: "000000000000000000000bb2",
						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					},
					{
						AccountId: 1,
						Id:        "d00000000000000000000bb2",
						DeviceId:  "d-bb2",
						ProfileId: "000000000000000000000bb2",
						CreatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			got, gotErr := client.ListDevicesByProfileIdentifier(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_ListDevicesByProfileIdentifier_ms12(t *testing.T) {
	var (
		ctx = context.TODO()
		// createdAt = protoTs(t, parseTime(t, "2017-06-14T15:44:18.496Z"))

		mdb = dialMongo(t, *tMongoDSN)
		db  = mongodb.New(mdb,
			mongodb.WithLogger(log.NewLog(log.Debug)),
			mongodb.WithObjectIDFunc(tNewObjectIdFunc(t, 0)),
		)
		svc = service.New(db, new(nopIndex), logNotifier(t))

		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.ListDevicesByProfileIdentifierRequest

		exp    *audience.ListDevicesByProfileIdentifierResponse
		expErr error
	}{
		{
			name: "profiles with no devices",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 16},
				ProfileIdentifier: "000000000000000000000000",
			},

			expErr: nil,
			exp:    &audience.ListDevicesByProfileIdentifierResponse{nil},
		},

		{
			name: "assinged profile: finds devices",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 16},
				ProfileIdentifier: "16aaaaaaaaaaaaaaaaaaaaaa",
			},

			expErr: nil,

			exp: &audience.ListDevicesByProfileIdentifierResponse{
				[]*audience.Device{
					{
						AccountId:         16,
						Id:                "16aaaaaaaaaaaaaaaaaaaaaa",
						DeviceId:          "16aaaaaaaaaaaaaaaaaaaaaa",
						ProfileId:         "16aaaaaaaaaaaaaaaaaaaaaa",
						ProfileIdentifier: "16aaaaaaaaaaaaaaaaaaaaaa",

						CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					},
				},
			},
		},

		{
			name: "anonymous profile: finds devices",
			req: &audience.ListDevicesByProfileIdentifierRequest{
				Ms12:              true,
				AuthContext:       &auth.AuthContext{AccountId: 16},
				ProfileIdentifier: "",
			},

			expErr: nil,

			exp: &audience.ListDevicesByProfileIdentifierResponse{
				[]*audience.Device{
					{
						AccountId:         16,
						Id:                "17aaaaaaaaaaaaaaaaaaaaaa",
						DeviceId:          "17aaaaaaaaaaaaaaaaaaaaaa",
						ProfileId:         "17aaaaaaaaaaaaaaaaaaaaaa",
						ProfileIdentifier: "",

						CreatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-10-14T15:44:18.497Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			got, gotErr := client.ListDevicesByProfileIdentifier(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

func testAudienceService_GetDeviceSchema(t *testing.T) {
	var (
		ctx = context.TODO()

		db = mongodb.New(
			dialMongo(t, *tMongoDSN),
		)

		svc              = service.New(db, new(nopIndex), logNotifier(t))
		client, teardown = NewSeviceClient(t, "localhost:51000", svc)
	)

	defer teardown()

	tcases := []struct {
		name string
		req  *audience.GetDeviceSchemaRequest

		exp    *audience.GetDeviceSchemaResponse
		expErr error
	}{
		{
			name: "no schema",
			req: &audience.GetDeviceSchemaRequest{
				AuthContext: &auth.AuthContext{
					AccountId: 0,
				},
			},

			exp: &audience.GetDeviceSchemaResponse{
				Schema: &audience.DeviceSchema{
					Attributes: nil,
				},
			},
		},
		{
			name: "a schema",
			req: &audience.GetDeviceSchemaRequest{
				AuthContext: &auth.AuthContext{AccountId: 33},
			},

			exp: &audience.GetDeviceSchemaResponse{
				Schema: &audience.DeviceSchema{
					Attributes: []*audience.SchemaAttribute{
						{
							Id:            "000000000000000000000f26",
							AccountId:     33,
							Attribute:     "arr",
							Label:         "arr",
							AttributeType: "array[string]",
							CreatedAt:     protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						},
						{
							Id:            "000000000000000000000f27",
							AccountId:     33,
							Attribute:     "string",
							Label:         "string",
							AttributeType: "string",
							CreatedAt:     protoTs(t, parseTime(t, "2016-08-22T19:05:53.102Z")),
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			var got, gotErr = client.GetDeviceSchema(ctx, tc.req)
			if diff := Diff(tc.exp, got, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}
		})
	}
}

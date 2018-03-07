package mongodb

import (
	"context"
	"io"
	"os"
	"testing"
	"time"

	"github.com/namsral/flag"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/go/log"
	rtesting "github.com/roverplatform/rover/go/testing"
)

var (
	tMongoDSN = flag.String("test.mongo.DSN", "mongodb://mongo:27017/audience_service_test", "mongodb to connect to")
)

var (
	Diff  = rtesting.Diff
	difff = rtesting.Difff
)

type (
	expect struct {
		expErr error
		exp    interface{}
	}
)

func dialMongo(t testing.TB, dsn string) *mgo.Database {
	t.Helper()
	info, err := mgo.ParseURL(dsn)
	if err != nil {
		t.Fatal("url.Parse:", err)
	}

	sess, err := mgo.DialWithInfo(info)
	if err != nil {
		t.Fatalf("dialMongo: %v", err)
	}

	return sess.DB(info.Database)
}

func truncateColl(t *testing.T, colls ...*mgo.Collection) {
	for _, coll := range colls {
		if err := coll.DropCollection(); err != nil {
			if err.Error() == "ns not found" {
				continue
			}
			t.Fatal("truncate:", err)
		}
	}
}

func decodeBSON(r io.Reader) ([]interface{}, error) {
	var (
		docs []interface{}
		dec  = NewJSONBSONDecoder(r)
	)

	for {
		var doc bson.M
		if err := dec.Decode(&doc); err != nil {
			if err == io.EOF {
				return docs, nil
			}

			return nil, err
		}

		docs = append(docs, doc)
	}
}

func loadFixture(t *testing.T, coll *mgo.Collection, fixturePath string) {
	f, err := os.Open(fixturePath)
	if err != nil {
		t.Fatal("testdata:", err)
	}

	docs, err := decodeBSON(f)
	if err != nil {
		t.Fatal("testdata: decodeBSON:", err)
	}

	if err := coll.Insert(docs...); err != nil {
		t.Fatal("testdata: insert:", err)
	}
}

func TestMongodb(t *testing.T) {
	var (
		mdb     = dialMongo(t, *tMongoDSN)
		devices = mdb.C("devices")
	)

	truncateColl(t, devices)

	loadFixture(t, devices, "../testdata/device-00.bson.json")
}

var _ = log.Debug

func TestMongodb_AddDeviceModelCommonName(t *testing.T) {
	var (
		ctx = context.TODO()

		updatedAt = time.Now().Truncate(time.Millisecond)

		mdb = dialMongo(t, *tMongoDSN)
		db  = New(
			mdb,
			WithTimeFunc(func() time.Time { return updatedAt }),
		)
		dev Device
	)

	type tCase struct {
		name string
		req  *audience.UpdateDeviceRequest

		expErr error
		exp    *audience.Device

		before, after *expect
	}

	tcases := []tCase{
		{
			name: "add device model common name and raw name",
			req: &audience.UpdateDeviceRequest{
				AuthContext:    &auth.AuthContext{AccountId: 1},
				DeviceId:       "adevice00",
				DeviceModel:    "iPhone 6",
				DeviceModelRaw: "iPhone7,2",
			},

			expErr: nil,

			before: &expect{
				expErr: nil,
				exp:    "",
			},

			after: &expect{
				expErr: nil,
				exp:    "iPhone7,2",
			},
		},
	}

	deviceModelRaw := func(id string) (string, error) {
		if err := db.devicesStore.devices().Find(bson.M{"device_id": id}).One(&dev); err != nil {
			return "", err
		}
		return dev.DeviceModelRaw, nil
	}

	for _, tc := range tcases {
		t.Run(tc.name, func(t *testing.T) {
			if tc.before != nil {
				var (
					got, gotErr = deviceModelRaw(tc.req.GetDeviceId())
					exp, expErr = tc.before.exp, tc.before.expErr
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			var _, gotErr = db.UpdateDevice(ctx, tc.req)
			if diff := Diff(nil, nil, tc.expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", difff(diff))
			}

			if tc.after != nil {
				var (
					got, gotErr = deviceModelRaw(tc.req.GetDeviceId())
					exp, expErr = tc.after.exp, tc.after.expErr
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

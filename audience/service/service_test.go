package service_test

import (
	"encoding/hex"
	"golang.org/x/net/context"
	"io"
	"math/rand"
	"net"
	"os"
	"testing"
	"time"

	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"

	"google.golang.org/grpc"

	"github.com/namsral/flag"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	audience_service "github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	rtesting "github.com/roverplatform/rover/go/testing"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	tMongoDSN        = flag.String("test.mongo.DSN", "mongodb://mongo:27017/audience_service_test", "mongodb to connect to")
	tGSvcAcctKeyPath = flag.String("test.google-service-acct-key-path", "", "google service acct key file")
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

type nopIndex struct{}

func (i *nopIndex) Query(context.Context, *audience.QueryRequest) (*audience.QueryResponse, error) {
	return nil, nil
}
func (i *nopIndex) GetDeviceTotalCount(context.Context, int) (int64, error) {
	return 0, nil
}
func (i *nopIndex) GetProfileTotalCount(context.Context, int) (int64, error) {
	return 0, nil
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

// predictable object id generator
func tNewObjectIdFunc(t *testing.T, seed int64) func() bson.ObjectId {
	var rnd = rand.New(rand.NewSource(seed))

	return func() bson.ObjectId {
		// keys must be 12 bytes long
		var bs [12]byte
		n, err := rnd.Read(bs[:])
		if err != nil {
			t.Fatalf("tNewObjectIdFunc: %v", err)
		}

		return bson.ObjectIdHex(hex.EncodeToString(bs[:n]))
	}
}

func parseTime(t *testing.T, str string) time.Time {
	t.Helper()
	ts, err := time.Parse(time.RFC3339Nano, str)
	if err != nil {
		t.Fatal("parseTime:", err)
	}

	return ts
}

func protoTs(t *testing.T, ti time.Time) *timestamp.Timestamp {
	t.Helper()
	ts, err := timestamp.TimestampProto(ti)
	if err != nil {
		t.Fatal("protoTs:", err)
	}
	return ts
}

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

func decodeBSON(r io.Reader) ([]interface{}, error) {
	var (
		docs []interface{}
		dec  = mongodb.NewJSONBSONDecoder(r)
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

func NewServer(rpcAddr string, srv audience.AudienceServer) (net.Listener, error) {
	lis, err := net.Listen("tcp", rpcAddr)
	if err != nil {
		return nil, err
	}

	grpcSrv := grpc.NewServer()

	audience_service.Register(grpcSrv, srv)

	go grpcSrv.Serve(lis)

	return lis, nil
}

func NewSeviceClient(t testing.TB, rpcAddr string, srv audience.AudienceServer) (audience.AudienceClient, func()) {
	lis, err := NewServer(rpcAddr, srv)
	if err != nil {
		t.Fatal("NewServer:", err)
	}

	time.Sleep(10 * time.Millisecond)

	conn, err := grpc.Dial(lis.Addr().String(), grpc.WithInsecure())
	if err != nil {
		t.Fatal("grpc.dial:", err)
	}

	client := audience.NewAudienceClient(conn)

	closer := func() {
		lis.Close()
		conn.Close()
	}

	return client, closer
}

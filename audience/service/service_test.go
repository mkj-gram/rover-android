package service_test

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
	"net"
	"os"
	"os/exec"
	"reflect"
	"strings"
	"testing"
	"time"

	"google.golang.org/grpc"

	"github.com/go-test/deep"
	"github.com/namsral/flag"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	audience_service "github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	tMongoDSN = flag.String("test.mongo.DSN", "mongodb://mongo:27017/audience_service_test", "mongodb to connect to")
)

type (
	expect struct {
		expErr error
		exp    interface{}
	}
)

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

func dialMongo(t *testing.T, dsn string) *mgo.Database {
	sess, err := mgo.Dial(dsn)
	if err != nil {
		t.Fatalf("dialMongo: %v", err)
	}

	dbName, err := mongodb.ParseDBName(dsn)
	if err != nil {
		t.Fatal("url.Parse:", err)
	}

	return sess.DB(dbName)
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

func parseTime(t *testing.T, str string) time.Time {
	ts, err := time.Parse(time.RFC3339Nano, str)
	if err != nil {
		t.Fatal("parseTime:", err)
	}

	return ts
}

func protoTs(t *testing.T, ti time.Time) *timestamp.Timestamp {
	ts, err := timestamp.TimestampProto(ti)
	if err != nil {
		t.Fatal("protoTs:", err)
	}
	return ts
}

func difff(diff []string) string {
	return strings.Join(diff, "\n")
}

func Diff(exp, got interface{}, expErr, gotErr error) []string {
	diffFn := deepDiff
	if os.Getenv("JSONDIFF") != "" {
		diffFn = jsonDiff
	}
	return diffFn(exp, got, expErr, gotErr)
}

func deepDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		return deep.Equal(expErr, gotErr)
	}

	return deep.Equal(exp, got)
}

func jsonDiff(exp, got interface{}, expErr, gotErr error) []string {
	// if an error case
	if expErr != nil || gotErr != nil {
		if !reflect.DeepEqual(expErr, gotErr) {
			return []string{
				fmt.Sprintf("%+v", expErr),
				fmt.Sprintf("%+v", gotErr),
			}
		}

		// error case skip the rest
		return nil
	}

	jsonStr := func(v interface{}) string {
		b, err := json.Marshal(v)
		if err != nil {
			panic(err)
		}

		var out bytes.Buffer
		json.Indent(&out, b, "", "  ")
		return out.String()
	}

	_ = jsonStr

	diffstr, err := diffCmd(jsonStr(exp), jsonStr(got))
	if err != nil {
		panic(err)
	}

	if !reflect.DeepEqual(exp, got) {
		// var diff, err := json.Marsha
		return []string{
			diffstr,
			// jsonStr(exp),
			// jsonStr(got),
		}
	}

	return nil
}

func diffCmd(exp, got string) (string, error) {
	fa, err := ioutil.TempFile("", "exp")
	if err != nil {
		return "", err
	}
	defer fa.Close()

	fb, err := ioutil.TempFile("", "got")
	if err != nil {
		return "", err
	}
	defer fb.Close()

	if _, err := fa.WriteString(exp + "\n"); err != nil {
		return "", err
	}
	if _, err := fb.WriteString(got + "\n"); err != nil {
		return "", err
	}
	fa.Sync()
	fb.Sync()

	cmd := exec.Command("diff", fa.Name(), fb.Name())
	data, err := cmd.Output()
	if err == exec.ErrNotFound {
		return "", err
	}

	return string(data), nil
}

func newServer(rpcAddr string, svc *audience_service.Server) (net.Listener, error) {
	lis, err := net.Listen("tcp", rpcAddr)
	if err != nil {
		return nil, err
	}

	srv := grpc.NewServer()

	audience_service.Register(srv, svc)

	go srv.Serve(lis)

	return lis, nil
}

func NewSeviceClient(t *testing.T, rpcAddr string, svc *audience_service.Server) (audience.AudienceClient, func()) {
	lis, err := newServer(rpcAddr, svc)
	if err != nil {
		t.Fatal("newServer:", err)
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

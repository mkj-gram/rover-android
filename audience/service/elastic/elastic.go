package elastic

import (
	"strconv"

	"golang.org/x/net/context"

	"github.com/pkg/errors"
	elastic "gopkg.in/olivere/elastic.v5"
)

var (
	InvalidArgument = errors.Errorf("invalid argument")
)

var (
	AccountIndex = func(id string) string {
		return "account_" + id
	}
	AccountIndexInt = func(id int) string {
		return AccountIndex(strconv.Itoa(id))
	}
)

type (
	DB struct {
		Client *elastic.Client
	}

	BulkResponse = elastic.BulkResponse
)

func (db *DB) Handle(ctx context.Context, ops []*BulkOp) (*BulkResponse, error) {
	bulkReq := db.Client.Bulk()

	for _, op := range ops {
		req, err := toBulkRequest(op)
		if err != nil {
			return nil, errors.Wrapf(err, "toBulkReq: %v", err)
		}
		bulkReq.Add(req)
	}

	resp, err := bulkReq.Do(ctx)

	return (*BulkResponse)(resp), errors.Wrap(err, "client.Bulk")
}

func (db *DB) HandleMapping(ctx context.Context, ims []*IndexMapping) error {
	for _, im := range ims {
		m := db.Client.PutMapping().
			Index(im.IndexName).
			Type("profile").
			BodyJson(im.Mapping)

		if _, err := m.Do(ctx); err != nil {
			return errors.Wrap(err, "client.PutMapping")
		}
	}

	return nil
}

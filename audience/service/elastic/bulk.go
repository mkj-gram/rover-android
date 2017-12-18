package elastic

import (
	"github.com/pkg/errors"
	"golang.org/x/net/context"
	elastic "gopkg.in/olivere/elastic.v5"
)

type (
	BulkOpKind string

	BulkOp struct {
		Id           string
		OpName       BulkOpKind
		IndexName    string
		DocumentType string
		Document     M
		ParentId     string
	}

	IndexMapping struct {
		IndexName string
		Mapping   M
	}
)

const (
	BulkOpIndex  = BulkOpKind("index")
	BulkOpDelete = BulkOpKind("delete")
)

type (
	BulkHandler struct {
		Client *elastic.Client
	}

	BulkResponse = elastic.BulkResponse
)

func (h *BulkHandler) Handle(ctx context.Context, ops []*BulkOp) (*BulkResponse, error) {
	bulkReq := h.Client.Bulk()

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

func (h *BulkHandler) HandleMapping(ctx context.Context, ims []*IndexMapping) error {
	for _, im := range ims {
		m := h.Client.PutMapping().
			Index(im.IndexName).
			Type("profile").
			BodyJson(im.Mapping)

		if _, err := m.Do(ctx); err != nil {
			return errors.Wrap(err, "client.PutMapping")
		}
	}

	return nil
}

func toBulkRequest(op *BulkOp) (elastic.BulkableRequest, error) {

	switch op.DocumentType {
	case "device":
		switch op.OpName {
		case BulkOpIndex:
			return elastic.NewBulkIndexRequest().
				Id(op.Id).
				Parent(op.ParentId).
				Type(op.DocumentType).
				Doc(op.Document).
				Index(op.IndexName), nil

		case BulkOpDelete:
			return elastic.NewBulkDeleteRequest().
				Id(op.Id).
				Parent(op.ParentId).
				Type(op.DocumentType).
				Index(op.IndexName), nil
		default:
			return nil, errors.Errorf("device: unexpected op: %+v", op)
		}

	case "profile":
		switch op.OpName {
		case BulkOpIndex:
			return elastic.NewBulkIndexRequest().
				Id(op.Id).
				Type(op.DocumentType).
				Doc(op.Document).
				Index(op.IndexName), nil

		case BulkOpDelete:
			return elastic.NewBulkDeleteRequest().
				Id(op.Id).
				Type(op.DocumentType).
				Index(op.IndexName), nil

		default:
			return nil, errors.Errorf("profile: unexpected op: %+v", op)
		}
	}

	return nil, errors.Errorf("unexpected op: %+v", op)
}

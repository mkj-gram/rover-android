package elastic

import (
	"github.com/pkg/errors"
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

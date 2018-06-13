package schema

import (
	"context"

	pb "github.com/roverplatform/rover/apis/go/schema/v1"
	"github.com/roverplatform/rover/events/backend/schema"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"

	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type SchemaStore interface {
	Find(ctx context.Context, id int32, version int32) (*schema.EventSchema, error)
}

type Server struct {
	db SchemaStore
}

func NewServer(repository SchemaStore) *Server {
	return &Server{
		db: repository,
	}
}

func (s *Server) Register(server *grpc.Server) {
	pb.RegisterSchemaServer(server, s)
}

func (s *Server) GetSchema(ctx context.Context, req *pb.GetSchemaRequest) (*pb.GetSchemaResponse, error) {
	eventSchema, err := s.db.Find(ctx, req.GetSchemaId(), req.GetSchemaVersion())
	if err != nil {
		if err == schema.ErrNotFound {
			return nil, status.Error(codes.NotFound, "Not Found")
		}
		return nil, status.Error(codes.Internal, err.Error())
	}

	var pbEventSchema = &pb.EventSchema{
		Id:        int32(eventSchema.Id),
		Version:   int32(eventSchema.Version),
		AccountId: eventSchema.AccountId,
		Namespace: eventSchema.Namespace,
		Name:      eventSchema.Name,
	}

	if eventSchema.CreatedAt != nil {
		if createdAtProto, err := timestamp.TimestampProto(*eventSchema.CreatedAt); err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		} else {
			pbEventSchema.CreatedAt = createdAtProto
		}
	}

	if attrSchema, err := attributesToProto(eventSchema.AttributeSchema); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	} else {
		pbEventSchema.AttributeSchema = attrSchema
	}

	return &pb.GetSchemaResponse{
		Schema: pbEventSchema,
	}, nil
}

func attributesToProto(s schema.ComplexType) (*pb.Complex, error) {
	var complex = &pb.Complex{
		Attributes: map[string]*pb.Type{},
	}

	for key, value := range s {
		switch v := value.(type) {
		case schema.ComplexType:
			nested, err := attributesToProto(v)
			if err != nil {
				return nil, err
			}
			complex.Attributes[key] = &pb.Type{
				Type: &pb.Type_Complex{
					Complex: nested,
				},
			}
		case schema.ArrayType:
			if scalar, err := scalarToProto(v.Type); err != nil {
				return nil, errors.Wrap(err, "scalarToProto")
			} else {
				complex.Attributes[key] = &pb.Type{
					Type: &pb.Type_Array{
						Array: &pb.Array{
							Subtype: scalar,
						},
					},
				}
			}
		case schema.ScalarType:
			if scalar, err := scalarToProto(v); err != nil {
				return nil, errors.Wrap(err, "scalarToProto")
			} else {
				complex.Attributes[key] = &pb.Type{
					Type: &pb.Type_Scalar{
						Scalar: scalar,
					},
				}
			}
		}
	}

	return complex, nil
}

func scalarToProto(scalar schema.ScalarType) (*pb.Scalar, error) {
	switch scalar {
	case schema.STRING:
		return &pb.Scalar{
			Type: pb.Scalar_STRING,
		}, nil
	case schema.NUMBER:
		return &pb.Scalar{
			Type: pb.Scalar_NUMBER,
		}, nil
	case schema.BOOLEAN:
		return &pb.Scalar{
			Type: pb.Scalar_BOOLEAN,
		}, nil
	case schema.TIMESTAMP:
		return &pb.Scalar{
			Type: pb.Scalar_TIMESTAMP,
		}, nil
	default:
		return nil, errors.Errorf("unknown scalar type: %s", scalar)
	}
}

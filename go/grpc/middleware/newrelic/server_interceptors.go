package grpc_newrelic

import (
	"github.com/newrelic/go-agent"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func UnaryServerInterceptor(app newrelic.Application) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		txn := app.StartTransaction(info.FullMethod, nil, nil)
		defer txn.End()
		newrelicCtx := context.WithValue(ctx, "newrelic-txn", txn)
		response, err := handler(newrelicCtx, req)
		if err != nil {
			if grpcError, ok := status.FromError(err); ok {
				code := grpcError.Code()
				if code == codes.Unknown || code == codes.Internal || code == codes.DataLoss || code == codes.Unavailable {
					txn.NoticeError(err)
				}
			} else {
				txn.NoticeError(err)
			}
		}

		return response, err
	}
}

package middleware

import (
	"golang.org/x/net/context"

	"google.golang.org/grpc"
)

func UnaryChain(ix ...grpc.UnaryServerInterceptor) grpc.UnaryServerInterceptor {
	var chain = func(c grpc.UnaryServerInterceptor, h grpc.UnaryHandler, info *grpc.UnaryServerInfo) grpc.UnaryHandler {
		return func(ctx context.Context, req interface{}) (interface{}, error) {
			return c(ctx, req, info, h)
		}
	}

	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		for i := range ix {
			handler = chain(ix[len(ix)-1-i], handler, info)
		}
		return handler(ctx, req)
	}
}

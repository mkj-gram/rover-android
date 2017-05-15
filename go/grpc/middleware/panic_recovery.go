package middleware

import (
	"golang.org/x/net/context"
	"runtime"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/grpclog"
)

const traceSize = 1024 * 1024 //bytes

// PanicHandler defines type that handles recovered errors
type PanicHandler func(panicVal interface{}, info *grpc.UnaryServerInfo) error

var DefaultPanicHandler = func(pval interface{}, info *grpc.UnaryServerInfo) error {
	trace := make([]byte, traceSize)
	trace = trace[:runtime.Stack(trace, false)]

	grpclog.Printf("rpc=%s panic=%q trace=%s\n", info.FullMethod, pval, string(trace))

	return grpc.Errorf(codes.Internal, "rpc=%s error=%q", info.FullMethod, pval)
}

// UnaryPanicRecovery defines grpc.UnaryServerInterceptor to recover from panics
func UnaryPanicRecovery(panicHandler PanicHandler) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		defer func() {
			if val := recover(); val != nil {
				err = panicHandler(val, info)
			}
		}()

		return handler(ctx, req)
	}
}

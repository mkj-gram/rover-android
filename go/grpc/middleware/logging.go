package middleware

import (
	"time"

	"golang.org/x/net/context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/status"
)

// UnaryPanicRecovery defines grpc.UnaryServerInterceptor to recover from panics
func UnaryLogger(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
	from := time.Now()

	resp, err = handler(ctx, req)

	dur := time.Now().Sub(from)
	if err != nil {
		if err, ok := status.FromError(err); ok {
			grpclog.Printf("rpc=%s dur=%s status=%s error=%q", info.FullMethod, dur, err.Code().String(), err.Message())
		} else if err != nil {
			grpclog.Printf("rpc=%s dur=%s status=Error error=%q", info.FullMethod, dur, err)
		}
	} else {
		grpclog.Printf("rpc=%s dur=%s status=OK", info.FullMethod, dur)
	}

	return resp, err
}

package middleware

import (
	"time"

	"golang.org/x/net/context"

	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/status"
)

// UnaryLogger simple logger middleware
// Deprecated: use UnaryLog
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

// UnaryLog simple logger middleware
// deprecated, use UnaryLog2
func UnaryLog(l interface{ Printf(string, ...interface{}) }) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		from := time.Now()

		resp, err = handler(ctx, req)

		dur := time.Now().Sub(from)
		if err != nil {
			if err, ok := status.FromError(err); ok {
				l.Printf("rpc=%s dur=%s status=%s error=%q", info.FullMethod, dur, err.Code().String(), err.Message())
			} else if err != nil {
				l.Printf("rpc=%s dur=%s status=Error error=%q", info.FullMethod, dur, err)
			}
		} else {
			l.Printf("rpc=%s dur=%s status=OK", info.FullMethod, dur)
		}

		return resp, err
	}
}

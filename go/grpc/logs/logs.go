package logs

import (
	"context"
	"runtime"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	rlog "github.com/roverplatform/rover/go/logger"
)

func Recoverer(log rlog.Logger) func(pval interface{}, info *grpc.UnaryServerInfo) error {
	return func(pval interface{}, info *grpc.UnaryServerInfo) error {
		var (
			buf   [16 * 1024]byte
			trace = buf[0:runtime.Stack(buf[:], false)]
		)

		log.WithFields(rlog.Fields{
			"rpc":   info.FullMethod,
			"trace": string(trace),
		}).Error(pval)

		return grpc.Errorf(codes.Internal, "rpc=%s error=%q", info.FullMethod, pval)
	}
}

// UnaryInterceptor simple logger middleware
func UnaryInterceptor(log rlog.Logger) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		start := time.Now()

		defer func() {
			log = log.WithFields(rlog.Fields{
				"rpc": info.FullMethod, "dur": time.Since(start),
			})
			if err != nil {
				if err, ok := status.FromError(err); ok {
					log.WithFields(rlog.Fields{"code": err.Code()}).Error(err.Message())
					return
				}
				log.Error(err.Error())
			} else {
				log.Info("")
			}
		}()

		resp, err = handler(ctx, req)

		return resp, err
	}
}

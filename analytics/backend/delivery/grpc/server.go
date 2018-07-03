package grpc

import (
	"net"
	"sort"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/roverplatform/rover/analytics/backend/usecase"
	"github.com/roverplatform/rover/apis/go/analytics/v1"
)

type Server struct {
	NotificationUseCase usecase.NotificationsInteractor

	grpcServer *grpc.Server
}

func (server *Server) ListenAndServe(addr string, opts ...grpc.ServerOption) error {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	grpcServer := grpc.NewServer(opts...)
	analytics.RegisterAnalyticsServer(grpcServer, server)

	server.grpcServer = grpcServer
	return grpcServer.Serve(lis)
}

func (server *Server) Shutdown() {
	server.grpcServer.GracefulStop()
}

func (server *Server) GetNotificationOpenedReport(ctx context.Context, req *analytics.GetNotificationOpenedReportRequest) (*analytics.GetNotificationOpenedReportResponse, error) {
	results, err := server.NotificationUseCase.GetOpenedReport(int(req.GetAuthContext().GetAccountId()), int(req.CampaignId))
	if err != nil {
		return nil, statusFromError(err)
	}

	return &analytics.GetNotificationOpenedReportResponse{
		Total:  int32(results.Total),
		Unique: int32(results.Unique),

		NotificationCenterTotal:  int32(results.NotificationCenterTotal),
		NotificationCenterUnique: int32(results.NotificationCenterUnique),

		PushDirectTotal:  int32(results.PushDirectTotal),
		PushDirectUnique: int32(results.PushDirectUnique),

		PushInfluencedTotal:  int32(results.PushInfluencedTotal),
		PushInfluencedUnique: int32(results.PushInfluencedUnique),
	}, nil
}

func (server *Server) GetNotificationOpenedByDateReport(ctx context.Context, req *analytics.GetNotificationOpenedByDateReportRequest) (*analytics.GetNotificationOpenedByDateReportResponse, error) {
	var (
		accountID  = int(req.GetAuthContext().GetAccountId())
		campaignID = int(req.CampaignId)
		from, to   time.Time
		zone       = time.UTC
	)

	if req.GetCursor() == nil {
		return nil, status.Error(codes.InvalidArgument, "cursor cannot be empty")
	}

	if req.GetTimeZone() != "" {
		loc, err := time.LoadLocation(req.GetTimeZone())
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "invalid timezone: %s", req.GetTimeZone())
		}
		zone = loc
	}

	// Default cursor
	cursor := &DateCursor{
		TimeZone: zone,
	}

	switch start := req.GetCursor().GetStart().(type) {
	case *analytics.Cursor_Before:
		var err error

		if err = cursor.FromBase64String(start.Before); err != nil {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}

		to, err = cursor.GetTimestamp()
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "could not parse before cursor: %v", err)
		}

		switch days := req.Cursor.Take.(type) {
		case *analytics.Cursor_First:
			return nil, status.Error(codes.Unimplemented, "cannot support before and first cursor")
		case *analytics.Cursor_Last:
			from = to.AddDate(0, 0, -int(days.Last))
		}

	case *analytics.Cursor_After:
		var err error
		if err = cursor.FromBase64String(start.After); err != nil {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}

		from, err = cursor.GetTimestamp()
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "could not parse after cursor: %v", err)
		}

		// Shift 1 day forward to make sure not to include the current cursor in the result
		from = from.AddDate(0, 0, 1)

		switch days := req.Cursor.Take.(type) {
		case *analytics.Cursor_First:
			to = from.AddDate(0, 0, int(days.First))
		case *analytics.Cursor_Last:
			return nil, status.Error(codes.Unimplemented, "cannot support after and last cursor")
		}

	default:
		switch days := req.Cursor.Take.(type) {
		case *analytics.Cursor_First:
			return nil, status.Error(codes.Unimplemented, "cannot support first without a starting cursor")
		case *analytics.Cursor_Last:
			var err error
			cursor.Date = time.Now().In(cursor.TimeZone).Format("2006-01-02")
			to, err = cursor.GetTimestamp()
			if err != nil {
				return nil, status.Errorf(codes.InvalidArgument, "could not get cursor start position: %v", err)
			}
			from = to.AddDate(0, 0, -int(days.Last))
		}
	}

	results, err := server.NotificationUseCase.GetOpenedReportByDate(accountID, campaignID, from, to)
	if err != nil {
		return nil, statusFromError(err)
	}

	var reports []*analytics.GetNotificationOpenedByDateReportResponse_DateReport

	for date, report := range results.Reports {
		reports = append(reports, &analytics.GetNotificationOpenedByDateReportResponse_DateReport{
			Id:                 date.String(),
			NotificationCenter: int32(report.NotificationCenter),
			PushDirect:         int32(report.PushDirect),
			PushInfluence:      int32(report.PushInfluenced),
			Cursor:             NewDateCursor(date.String(), cursor.TimeZone).ToBase64String(),
		})
	}

	sort.SliceStable(reports, func(i, j int) bool {
		return reports[i].Id < reports[j].Id
	})

	var pageInfo = &analytics.PageInfo{
		HasPreviousPage: true,
		HasNextPage:     to.Before(time.Now().In(cursor.TimeZone).Truncate(time.Hour * 24)),
	}

	return &analytics.GetNotificationOpenedByDateReportResponse{
		Reports:  reports,
		PageInfo: pageInfo,
	}, nil
}

func (server *Server) GetNotificationSentReport(ctx context.Context, req *analytics.GetNotificationSentReportRequest) (*analytics.GetNotificationSentReportResponse, error) {
	results, err := server.NotificationUseCase.GetSentReport(int(req.GetAuthContext().GetAccountId()), int(req.CampaignId))
	if err != nil {
		return nil, statusFromError(err)
	}

	return &analytics.GetNotificationSentReportResponse{
		TotalDelivered:                int32(results.TotalDelivered),
		UniqueDelivered:               int32(results.UniqueDelivered),
		NotificationCenterAttempted:   int32(results.NotificationCenterAttempted),
		NotificationCenterDelivered:   int32(results.NotificationCenterDelivered),
		NotificationCenterUnreachable: int32(results.NotificationCenterUnreachable),
		NotificationCenterInvalid:     int32(results.NotificationCenterInvalid),

		PushAttempted:   int32(results.PushAttempted),
		PushDelivered:   int32(results.PushDelivered),
		PushUnreachable: int32(results.PushUnreachable),
		PushInvalid:     int32(results.PushInvalid),
	}, nil
}

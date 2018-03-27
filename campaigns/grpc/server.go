package campaigns_grpc

import (
	"context"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pkg/errors"
	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/campaigns"
	"github.com/roverplatform/rover/campaigns/db"
	va "github.com/roverplatform/rover/campaigns/validations"
	"github.com/roverplatform/rover/go/zoneinfo"
)

var (
	// compile time check Server conforms to campaigns.CampaignsService interface
	_ campaignspb.CampaignsServer = (*Server)(nil)

	// Register is a convenience wrapper
	Register = campaignspb.RegisterCampaignsServer
)

type Server struct {
	DB *db.DB
}

func (s *Server) Create(ctx context.Context, req *campaignspb.CreateRequest) (*campaignspb.CreateResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_type", int32(req.CampaignType), va.Require),
		va.Value("name", req.Name, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var campaign, err = s.DB.CampaignsStore().Create(ctx, acctId, req.Name, int32(req.CampaignType))
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.Create: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.CreateResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) Get(ctx context.Context, req *campaignspb.GetRequest) (*campaignspb.GetResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var campaign, err = s.DB.CampaignsStore().OneById(ctx, acctId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.OneById: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.GetResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) List(ctx context.Context, req *campaignspb.ListRequest) (*campaignspb.ListResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()

	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var (
		params = db.ListParams{
			AccountId:      req.AuthContext.AccountId,
			CampaignStatus: int32(req.CampaignStatus),
			CampaignType:   int32(req.CampaignType),
			Keyword:        req.Keyword,
			PageSize:       req.PageSize,
			Page:           req.Page,
		}

		isScheduledType = func(c *campaigns.Campaign) bool {
			return campaignspb.CampaignType_Enum(c.CampaignType) ==
				campaignspb.CampaignType_SCHEDULED_NOTIFICATION
		}
	)

	var campaigns, err = s.DB.CampaignsStore().List(ctx, params)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.List: %v", err)
	}

	var scheduledCampaignIds []int32
	for i := range campaigns {
		if !isScheduledType(campaigns[i]) {
			continue
		}
		scheduledCampaignIds = append(scheduledCampaignIds, campaigns[i].CampaignId)
	}

	if len(scheduledCampaignIds) > 0 {
		csx, err := s.DB.ScheduledTasksStore().ListDeliveryStatuses(ctx, scheduledCampaignIds)
		if err != nil {
			return nil, status.Errorf(ErrorToStatus(err), "ListDeliveryStatuses: %v", err)
		}

		var deliveryStatusByCampaignId = DeliveryStatusByCampaignId(csx)
		for i := range campaigns {
			if !isScheduledType(campaigns[i]) {
				continue
			}
			if s, ok := deliveryStatusByCampaignId[campaigns[i].CampaignId]; ok {
				campaigns[i].ScheduledDeliveryStatus = int32(s)
			}
		}
	}

	var protos []*campaignspb.Campaign
	for i := range campaigns {
		var proto campaignspb.Campaign
		if err := CampaignToProto(campaigns[i], &proto); err != nil {
			return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
		}

		protos = append(protos, &proto)
	}

	return &campaignspb.ListResponse{
		Campaigns: protos,
	}, nil
}

func (s *Server) Duplicate(ctx context.Context, req *campaignspb.DuplicateRequest) (*campaignspb.DuplicateResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	dup, err := s.DB.CampaignsStore().OneById(ctx, acctId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.OneById: %v", err)
	}

	if req.Name != "" {
		dup.Name = req.Name
	} else {
		dup.Name = dup.Name + " Copy"
	}

	campaign, err := s.DB.CampaignsStore().Insert(ctx, *dup)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.Duplicate: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.DuplicateResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) Rename(ctx context.Context, req *campaignspb.RenameRequest) (*campaignspb.RenameResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
		va.Value("name", req.Name, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	if err := s.DB.CampaignsStore().Rename(ctx, acctId, req.CampaignId, req.Name); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.Rename: %v", err)
	}

	return &campaignspb.RenameResponse{}, nil
}

func (s *Server) Archive(ctx context.Context, req *campaignspb.ArchiveRequest) (*campaignspb.ArchiveResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var (
		cStatus = int32(campaignspb.CampaignStatus_ARCHIVED)
	)

	if err := s.DB.CampaignsStore().UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateStatus: %v", err)
	}

	return &campaignspb.ArchiveResponse{}, nil
}

func (s *Server) Publish(ctx context.Context, req *campaignspb.PublishRequest) (*campaignspb.PublishResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var (
		cStatus = int32(campaignspb.CampaignStatus_PUBLISHED)
	)

	tx, err := s.DB.Begin()
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.Begin: %v", err)
	}

	defer tx.Rollback()

	if err := tx.CampaignsStore().UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateStatus: %v", err)
	}

	c, err := s.DB.CampaignsStore().OneById(ctx, acctId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.OneById: %v", err)
	}

	var (
		resp campaignspb.PublishResponse

		publishAutomated = func() error {
			// TODO: nothing to publish other than updating status?
			return nil
		}

		publishScheduled = func() error {
			_ /* taskIds */, err := s.scheduleTasks(ctx, tx, c)
			if err != nil {
				return status.Errorf(ErrorToStatus(err), "ScheduleTasks: %v", err)
			}

			return nil
		}
	)

	if err := func() error {
		switch campaignType := campaignspb.CampaignType_Enum(c.CampaignType); campaignType {
		case campaignspb.CampaignType_SCHEDULED_NOTIFICATION:
			return publishScheduled()
		case campaignspb.CampaignType_AUTOMATED_NOTIFICATION:
			return publishAutomated()
		default:
			return status.Errorf(codes.InvalidArgument, "Campaign Type: unknown: %q(%v)", campaignType.String(), campaignType)
		}
	}(); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "Publish: %v", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, status.Errorf(codes.Canceled, "tx.Commit: %v", err)
	}

	return &resp, nil
}

func (s *Server) scheduleTasks(ctx context.Context, tx *db.Tx, c *campaigns.Campaign) ([]int64, error) {
	var (
		taskIds []int64

		scheduleAtAbsoluteTime = func(runAt time.Time) error {
			var createTask = db.CreateScheduledNotificationTask{
				RunAt:      runAt,
				ScrollId:   "",
				CampaignId: int(c.CampaignId),
				AccountId:  int(c.AccountId),
				// not used when !ScheduledUseLocalDeviceTime
				// TimzoneOffset: c.ScheduledTimeZone,
			}

			taskId, err := tx.ScheduledTasksStore().Create(ctx, createTask)
			if err != nil {
				return status.Errorf(ErrorToStatus(err), "scheduled_notification_task.Create: %v", err)
			}

			taskIds = append(taskIds, taskId)

			return nil
		}

		scheduleAtDeviceTime = func(runAt time.Time) error {
			for _, tzOffsetSeconds := range zoneinfo.UniqueOffsets {
				var (
					createTask = db.CreateScheduledNotificationTask{
						AccountId:  int(c.AccountId),
						CampaignId: int(c.CampaignId),

						RunAt:          runAt.Add(time.Duration(tzOffsetSeconds) * time.Second),
						TimezoneOffset: int(tzOffsetSeconds),

						ScrollId: "",
					}
				)

				taskId, err := tx.ScheduledTasksStore().Create(ctx, createTask)
				if err != nil {
					return status.Errorf(ErrorToStatus(err), "scheduled_notification_task.Create: %v", err)
				}

				taskIds = append(taskIds, taskId)
			}
			return nil
		}
	)

	var runAt time.Time
	switch scheduledType := campaignspb.ScheduledType_Enum(c.ScheduledType); scheduledType {
	case campaignspb.ScheduledType_NOW:
		runAt = db.TimeNow()
	case campaignspb.ScheduledType_SCHEDULED:
		if c.ScheduledTimestamp == nil {
			return nil, status.Errorf(codes.InvalidArgument, "validation: ScheduledTimestamp: is required.")
		}
		runAt = *c.ScheduledTimestamp
	default:
		return nil, status.Errorf(codes.InvalidArgument, "Scheduled Type: unknown: %q(%v)", scheduledType.String(), scheduledType)
	}

	if c.ScheduledUseLocalDeviceTime {
		return taskIds, scheduleAtDeviceTime(runAt)
	}
	return taskIds, scheduleAtAbsoluteTime(runAt)
}

func (s *Server) UpdateNotificationSettings(ctx context.Context, req *campaignspb.UpdateNotificationSettingsRequest) (*campaignspb.UpdateNotificationSettingsResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var update campaigns.UpdateNotificationSettingsRequest

	if err := protoToUpdateNotificationSettingsRequest(req, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "fromProto: %v", err)
	}

	prev, err := s.DB.CampaignsStore().OneById(ctx, req.AuthContext.AccountId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.OneById: %v", err)
	}

	if err := s.canUpdateState(ctx, prev); err != nil {
		return nil, err
	}

	campaign, err := s.DB.CampaignsStore().UpdateNotificationSettings(ctx, &update)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateNotificationSettings: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.UpdateNotificationSettingsResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) canUpdateState(ctx context.Context, campaign *campaigns.Campaign) error {
	switch campaignspb.CampaignType_Enum(campaign.CampaignType) {
	case campaignspb.CampaignType_AUTOMATED_NOTIFICATION:
		// TODO
		return nil
	case campaignspb.CampaignType_SCHEDULED_NOTIFICATION:
		var (
			campaignStatus     = campaignspb.CampaignStatus_Enum(campaign.CampaignStatus)
			isDraftOrPublished = campaignStatus == campaignspb.CampaignStatus_DRAFT ||
				campaignStatus == campaignspb.CampaignStatus_PUBLISHED
		)

		if !isDraftOrPublished {
			return status.Errorf(codes.FailedPrecondition, "CampaignStatus: %v", campaignStatus)
		}

		deliveryStatus, err := s.scheduledDeliveryStatus(ctx, campaign.CampaignId)
		if err != nil {
			return status.Errorf(ErrorToStatus(err), "campaigns.ScheduledDeliveryStatus: %v", err)
		}

		// TODO: there's a race condition
		// between determining scheduled delivery status
		// and allowing the update
		var isScheduled = deliveryStatus == campaignspb.ScheduledDeliveryStatus_SCHEDULED
		if !isScheduled {
			return status.Errorf(codes.FailedPrecondition, "ScheduledDeliveryStatus: %v", deliveryStatus.String())
		}
	}

	return nil
}

func (s *Server) UpdateScheduledDeliverySettings(ctx context.Context, req *campaignspb.UpdateScheduledDeliverySettingsRequest) (*campaignspb.UpdateScheduledDeliverySettingsResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
		va.Value("scheduled_type", req.ScheduledType, requireScheduledType),
		va.Value("scheduled_timestamp", req.ScheduledTimestamp, requireTimestampOnScheduled(req)),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var update campaigns.UpdateScheduledDeliverySettingsRequest
	if err := protoToUpdateScheduledDeliverySettingsRequest(req, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "fromProto: %v", err)
	}

	prev, err := s.DB.CampaignsStore().OneById(ctx, req.AuthContext.AccountId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.OneById: %v", err)
	}

	if err := s.canUpdateState(ctx, prev); err != nil {
		return nil, err
	}

	tx, err := s.DB.Begin()
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.Begin: %v", err)
	}

	defer tx.Rollback()

	campaign, err := tx.CampaignsStore().UpdateScheduledDeliverySettings(ctx, &update)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateScheduledDeliverySettings: %v", err)
	}

	var (
		scheduledTimeChanged = func() (time.Time, bool) {
			switch req.ScheduledType {
			case campaignspb.ScheduledType_NOW:
				if prev.ScheduledType == update.ScheduledType {
					return time.Time{}, false
				}
				return db.TimeNow(), true
			case campaignspb.ScheduledType_SCHEDULED:
				if prev.ScheduledType != update.ScheduledType {
					return *update.ScheduledTimestamp, true
				}

				if prev.ScheduledTimestamp.Equal(*update.ScheduledTimestamp) {
					return time.Time{}, false
				}

				return *update.ScheduledTimestamp, true
			default:
				panic(errors.Errorf("ScheduledType: unknown: %v", update.ScheduledType))
			}
		}

		useLocalDeviceTimeChanged = func() bool {
			return prev.ScheduledUseLocalDeviceTime != req.ScheduledUseLocalDeviceTime
		}

		isPublished = func() bool {
			return campaignspb.CampaignStatus_Enum(campaign.CampaignStatus) == campaignspb.CampaignStatus_PUBLISHED
		}
	)

	if isPublished() {
		if useLocalDeviceTimeChanged() {
			if _ /*n*/, err := tx.ScheduledTasksStore().DeleteByCampaignId(ctx, acctId, int64(req.CampaignId)); err != nil {
				return nil, status.Errorf(ErrorToStatus(err), "tasks.DeleteByCampaignId: %v", err)
			}

			_ /*taskIds*/, err := s.scheduleTasks(ctx, tx, campaign)
			if err != nil {
				return nil, status.Errorf(ErrorToStatus(err), "scheduleTasks: %v", err)
			}
		} else {
			if runAt, ok := scheduledTimeChanged(); ok {
				if _, err := tx.ScheduledTasksStore().Reschedule(ctx, runAt, req.CampaignId); err != nil {
					return nil, status.Errorf(ErrorToStatus(err), "tasks.Reschedule: %v", err)
				}
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, status.Errorf(codes.Canceled, "tx.Commit: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.UpdateScheduledDeliverySettingsResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) scheduledDeliveryStatus(ctx context.Context, campaignId int32) (campaignspb.ScheduledDeliveryStatus_Enum, error) {
	sdsx, err := s.DB.ScheduledTasksStore().ListDeliveryStatuses(ctx, []int32{campaignId})
	if err != nil {
		return campaignspb.ScheduledDeliveryStatus_UNKNOWN, status.Errorf(ErrorToStatus(err), "ListDeliveryStatuses: %v", err)
	}

	// no items means no tasks have been created:
	if len(sdsx) == 0 {
		return campaignspb.ScheduledDeliveryStatus_SCHEDULED, nil
	}

	if s, ok := DeliveryStatusByCampaignId(sdsx)[campaignId]; ok {
		return s, nil
	}

	panic(errors.Errorf("SheduledDeliveryStatus: undefined"))
}

func requireScheduledType(val interface{}) error {
	switch v := val.(type) {
	case campaignspb.ScheduledType_Enum:
		switch v {
		case
			campaignspb.ScheduledType_NOW,
			campaignspb.ScheduledType_SCHEDULED:
			return nil
		}
	}
	return status.Errorf(codes.InvalidArgument, "unexpected value(%T) = %v", val, val)
}

type validator func(val interface{}) error

func requireTimestampOnScheduled(req *campaignspb.UpdateScheduledDeliverySettingsRequest) validator {
	return func(val interface{}) error {
		if req.ScheduledType != campaignspb.ScheduledType_SCHEDULED {
			return nil
		}
		if req.ScheduledTimestamp != nil && req.ScheduledTimestamp.Seconds > 0 {
			return nil
		}

		return va.ErrRequired
	}
}

func (s *Server) UpdateAutomatedDeliverySettings(ctx context.Context, req *campaignspb.UpdateAutomatedDeliverySettingsRequest) (*campaignspb.UpdateAutomatedDeliverySettingsResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var update campaigns.UpdateAutomatedDeliverySettingsRequest
	if err := protoToUpdateAutomatedDeliverySettingsRequest(req, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "fromProto: %v", err)
	}

	campaign, err := s.DB.CampaignsStore().UpdateAutomatedDeliverySettings(ctx, &update)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateAutomatedDeliverySettings: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.UpdateAutomatedDeliverySettingsResponse{
		Campaign: &proto,
	}, nil
}

func (s *Server) SendTest(ctx context.Context, req *campaignspb.SendTestRequest) (*campaignspb.SendTestResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	if len(req.DeviceIds) == 0 {
		return nil, status.Errorf(codes.InvalidArgument, "validate: device_ids: must not be empty.")
	}

	var (
		createTask = db.CreateScheduledNotificationTask{
			AccountId:  int(acctId),
			CampaignId: int(req.GetCampaignId()),
			RunAt:      db.TimeNow(),
			DeviceIds:  req.GetDeviceIds(),
			IsTest:     true,
			// ScrollId: "",
			// TimezoneOffset: 0,
		}
	)

	// TODO: log task id created
	if _, err := s.DB.ScheduledTasksStore().Create(ctx, createTask); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "ScheduledTasks.Create: %v", err)
	}

	return &campaignspb.SendTestResponse{
		//
	}, nil
}

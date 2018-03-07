package campaigns_grpc

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/campaigns"
	"github.com/roverplatform/rover/campaigns/db"
	va "github.com/roverplatform/rover/campaigns/validations"
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

	var campaign, err = s.DB.Create(ctx, acctId, req.Name, int32(req.CampaignType))
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
	)

	var campaigns, err = s.DB.List(ctx, params)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.List: %v", err)
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

	dup, err := s.DB.OneById(ctx, acctId, req.CampaignId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.OneById: %v", err)
	}

	if req.Name != "" {
		dup.Name = req.Name
	} else {
		dup.Name = dup.Name + " Copy"
	}

	campaign, err := s.DB.Insert(ctx, *dup)
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

	if err := s.DB.Rename(ctx, acctId, req.CampaignId, req.Name); err != nil {
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

	if err := s.DB.UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.UpdateStatus: %v", err)
	}

	return &campaignspb.ArchiveResponse{}, nil
}

func (s *Server) Unarchive(ctx context.Context, req *campaignspb.UnarchiveRequest) (*campaignspb.UnarchiveResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var (
		cStatus = int32(campaignspb.CampaignStatus_DRAFT)
	)

	if err := s.DB.UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateStatus: %v", err)
	}

	return &campaignspb.UnarchiveResponse{}, nil
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

	if err := s.DB.UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.UpdateStatus: %v", err)
	}

	return &campaignspb.PublishResponse{}, nil
}

func (s *Server) Unpublish(ctx context.Context, req *campaignspb.UnpublishRequest) (*campaignspb.UnpublishResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var (
		cStatus = int32(campaignspb.CampaignStatus_DRAFT)
	)

	// TODO: first make sure the status of the campaign is published before
	// we update the status. If the status matches we can safely update and
	// apply the appropriate side affects. We might need to wrap this in a
	// transaction to ensure we delete all tasks queued up for the campaign
	if err := s.DB.UpdateStatus(ctx, acctId, req.CampaignId, cStatus); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "campaigns.UpdateStatus: %v", err)
	}

	return &campaignspb.UnpublishResponse{}, nil
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

	campaign, err := s.DB.UpdateNotificationSettings(ctx, &update)

	if err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.UpdateNotificationSettings: %v", err)
	}

	var proto campaignspb.Campaign
	if err := CampaignToProto(campaign, &proto); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "toProto: %v", err)
	}

	return &campaignspb.UpdateNotificationSettingsResponse{
		Campaign: &proto,
	}, nil
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

	if err := s.DB.UpdateAutomatedDeliverySettings(ctx, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.UpdateAutomatedDeliverySettings: %v", err)
	}

	return &campaignspb.UpdateAutomatedDeliverySettingsResponse{}, nil
}

func (s *Server) UpdateScheduledDeliverySettings(ctx context.Context, req *campaignspb.UpdateScheduledDeliverySettingsRequest) (*campaignspb.UpdateScheduledDeliverySettingsResponse, error) {
	var acctId = req.GetAuthContext().GetAccountId()
	if err := va.All(
		va.Value("auth_context", va.Pointer(req.AuthContext), va.Require),
		va.Value("account_id", acctId, va.Require),
		va.Value("campaign_id", req.CampaignId, va.Require),
	); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "validate: %v", err)
	}

	var update campaigns.UpdateScheduledDeliverySettingsRequest
	if err := protoToUpdateScheduledDeliverySettingsRequest(req, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "fromProto: %v", err)
	}

	if err := s.DB.UpdateScheduledDeliverySettings(ctx, &update); err != nil {
		return nil, status.Errorf(ErrorToStatus(err), "db.UpdateScheduledDeliverySettings: %v", err)
	}

	return &campaignspb.UpdateScheduledDeliverySettingsResponse{}, nil
}

func (s *Server) SendTest(context.Context, *campaignspb.SendTestRequest) (*campaignspb.SendTestResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Unimplemented")
}

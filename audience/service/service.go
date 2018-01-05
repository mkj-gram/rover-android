package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/audience/service/predicates"
)

// ensure the interface is implemented

var (
	_ audience.AudienceServer = (*Server)(nil)

	// Register provides a convenient wrapper around generated function
	Register = audience.RegisterAudienceServer
)

type (

	// Server implements the audience service grpc interface
	Server struct {
		db     *mongodb.DB
		notify *serviceNotify
		index  Index
	}

	Index interface {
		Query(context.Context, *audience.QueryRequest) (*audience.QueryResponse, error)
		GetProfileTotalCount(context.Context, int) (int64, error)
		GetDeviceTotalCount(context.Context, int) (int64, error)
		GetFieldSuggestion(context.Context, *audience.GetFieldSuggestionRequest) (*audience.GetFieldSuggestionResponse, error)
	}
)

// New creates new Server instance with all the options provided
func New(db *mongodb.DB, index Index, notifier Notifier) *Server {
	return &Server{
		db:    db,
		index: index,
		notify: &serviceNotify{
			Notifier: notifier,
		},
	}
}

//
// Devices
//

// GetDevice implements the corresponding rpc
func (s *Server) GetDevice(ctx context.Context, r *audience.GetDeviceRequest) (*audience.GetDeviceResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	d, err := db.GetDevice(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDevice: %v", err)
	}

	return &audience.GetDeviceResponse{d}, nil
}

// GetDeviceByPushToken implements the corresponding rpc
func (s *Server) GetDeviceByPushToken(ctx context.Context, r *audience.GetDeviceByPushTokenRequest) (*audience.GetDeviceByPushTokenResponse, error) {
	if err := validateID(r.GetPushTokenKey()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: PushTokenKey: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	d, err := db.GetDeviceByPushToken(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceByPushToken: %v", err)
	}

	return &audience.GetDeviceByPushTokenResponse{d}, nil
}

// CreateDevice implements the corresponding rpc
func (s *Server) CreateDevice(ctx context.Context, r *audience.CreateDeviceRequest) (*audience.CreateDeviceResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	// TODO: ms-12
	if r.Ms12 {
		if r.GetProfileId() != "" {
			return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: deprecated")
		}

		// TODO: ms-12: note it returns associated profile
		var profile, err = db.CreateDevice_Ms12(ctx, r)
		if err != nil {
			return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateDevice_ms12: %v", err)
		}
		s.notify.profileUpdated(ctx, r.AuthContext.AccountId, profile.Id, profile.Identifier)
		s.notify.deviceCreated(ctx, r.AuthContext.AccountId, profile.Id, r.DeviceId)

		return &audience.CreateDeviceResponse{}, nil
	}

	if err := db.CreateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateDevice: %v", err)
	}
	s.notify.deviceCreated(ctx, r.AuthContext.AccountId, r.ProfileId, r.DeviceId)

	return &audience.CreateDeviceResponse{}, nil
}

// UpdateDevice implements the corresponding rpc
func (s *Server) UpdateDevice(ctx context.Context, r *audience.UpdateDeviceRequest) (*audience.UpdateDeviceResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	// TODO: use find and modify to avoid DB 2 calls
	if err := db.UpdateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevice: %v", err)
	}
	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceResponse{}, nil
}

// UpdateDeviceCustomAttributes implements the corresponding rpc
func (s *Server) UpdateDeviceCustomAttributes(ctx context.Context, r *audience.UpdateDeviceCustomAttributesRequest) (*audience.UpdateDeviceCustomAttributesResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	if err := validateTags(r.GetAttributes()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: tags: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	schemaUpdated, err := db.UpdateDeviceCustomAttributes(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceCustomAttributes: %v", err)
	}

	// TODO: ms-12
	profileId, profileIdentifier, err := db.GetDeviceProfileIdAndIdentifierById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}

	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)
	// NOTE: ms-12: profile attributes get updated as weel
	s.notify.profileUpdated(ctx, r.AuthContext.AccountId, profileId, profileIdentifier)
	if schemaUpdated {
		// since deviceSchema <-> profileSchema is duplicated
		s.notify.profileSchemaUpdated(ctx, r.AuthContext.AccountId)
		// TODO: ms-12: disable once changes need to be pushed to the index
		// s.notify.deviceSchemaUpdated(ctx, r.AuthContext.AccountId)
	}

	return &audience.UpdateDeviceCustomAttributesResponse{}, nil
}

// UpdateDeviceTestProperty implements the corresponding rpc
func (s *Server) UpdateDeviceTestProperty(ctx context.Context, r *audience.UpdateDeviceTestPropertyRequest) (*audience.UpdateDeviceTestPropertyResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceTestProperty(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceTestProperty: %v", err)
	}
	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceTestPropertyResponse{}, nil
}

// UpdateDeviceLabelProperty implements the corresponding rpc
func (s *Server) UpdateDeviceLabelProperty(ctx context.Context, r *audience.UpdateDeviceLabelPropertyRequest) (*audience.UpdateDeviceLabelPropertyResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceLabelProperty(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceLabelProperty: %v", err)
	}
	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceLabelPropertyResponse{}, nil
}

// DeleteDevice implements the corresponding rpc
func (s *Server) DeleteDevice(ctx context.Context, r *audience.DeleteDeviceRequest) (*audience.DeleteDeviceResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}

	if err := db.DeleteDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteDevice: %v", err)
	}

	s.notify.deviceDeleted(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.DeleteDeviceResponse{}, nil
}

// SetDeviceProfile implements the corresponding rpc
func (s *Server) SetDeviceProfile(ctx context.Context, r *audience.SetDeviceProfileRequest) (*audience.SetDeviceProfileResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	// TODO: ms-12
	if r.Ms12 {
		if r.GetProfileId() != "" {
			return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: deprecated")
		}

		// TODO: optimize this query out
		before, err := db.FindDeviceById(ctx, r.DeviceId)
		if err != nil {
			return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.FindDeviceById: before: %v", err)
		}

		// to ensure write and consequent read are made on the same node
		// otherwise the read data may get stale
		db.SetModeStrong()
		db.ModeRefresh()

		if err := db.SetDeviceProfile_Ms12(ctx, r); err != nil {
			return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.SetDeviceProfile_Ms12: %v", err)
		}
		// TODO: optimize this query out
		after, err := db.FindDeviceById(ctx, r.DeviceId)
		if err != nil {
			return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.FindDeviceById: after: %v", err)
		}
		// NOTE: profile may get created, so needs a notification
		// it will eventually be removed
		s.notify.profileUpdated(ctx, r.AuthContext.AccountId, after.ProfileId, after.ProfileIdentifier)
		s.notify.deviceProfileIdentifierUpdated(ctx, r.AuthContext.AccountId, before.ProfileIdentifier, after.ProfileIdentifier, r.DeviceId)

		return &audience.SetDeviceProfileResponse{}, nil
	}

	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	oldProfileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}

	if err := db.SetDeviceProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.SetDeviceProfile: %v", err)
	}
	s.notify.deviceProfileUpdated(ctx, r.AuthContext.AccountId, oldProfileId, r.ProfileId, r.DeviceId)

	return &audience.SetDeviceProfileResponse{}, nil
}

// UpdateDevicePushToken implements the corresponding rpc
func (s *Server) UpdateDevicePushToken(ctx context.Context, r *audience.UpdateDevicePushTokenRequest) (*audience.UpdateDevicePushTokenResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDevicePushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevicePushToken: %v", err)
	}

	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDevicePushTokenResponse{}, nil
}

// UpdateDeviceUnregisterPushToken implements the corresponding rpc
func (s *Server) UpdateDeviceUnregisterPushToken(ctx context.Context, r *audience.UpdateDeviceUnregisterPushTokenRequest) (*audience.UpdateDeviceUnregisterPushTokenResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceUnregisterPushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceUnregisterPushToken: %v", err)
	}

	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceUnregisterPushTokenResponse{}, nil
}

// UpdateDeviceLocation implements the corresponding rpc
func (s *Server) UpdateDeviceLocation(ctx context.Context, r *audience.UpdateDeviceLocationRequest) (*audience.UpdateDeviceLocationResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceLocation(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceLocation: %v", err)
	}

	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceLocationResponse{}, nil
}

// UpdateDeviceGeofenceMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceGeofenceMonitoring(ctx context.Context, r *audience.UpdateDeviceGeofenceMonitoringRequest) (*audience.UpdateDeviceGeofenceMonitoringResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceGeofenceMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceGeofenceMonitoring: %v", err)
	}
	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceGeofenceMonitoringResponse{}, nil
}

// UpdateDeviceIBeaconMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceIBeaconMonitoring(ctx context.Context, r *audience.UpdateDeviceIBeaconMonitoringRequest) (*audience.UpdateDeviceIBeaconMonitoringResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDeviceIBeaconMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceIBeaconMonitoring: %v", err)
	}
	profileId, err := db.GetDeviceProfileIdById(ctx, r.AuthContext.AccountId, r.DeviceId)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceProfileIdById: %v", err)
	}
	s.notify.deviceUpdated(ctx, r.AuthContext.AccountId, profileId, r.DeviceId)

	return &audience.UpdateDeviceIBeaconMonitoringResponse{}, nil
}

func (s *Server) ListDevicesByProfileId(ctx context.Context, r *audience.ListDevicesByProfileIdRequest) (*audience.ListDevicesByProfileIdResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	if r.Ms12 {
		return nil, status.Errorf(codes.Unimplemented, "Validation: FindDevicesByProfileId: not implemented")
	}

	devices, err := db.ListDevicesByProfileId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileId: %v", err)
	}

	return &audience.ListDevicesByProfileIdResponse{devices}, nil
}

func (s *Server) ListDevicesByProfileIdentifier(ctx context.Context, r *audience.ListDevicesByProfileIdentifierRequest) (*audience.ListDevicesByProfileIdentifierResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	//TODO: ms-12
	if r.Ms12 {
		devices, err := db.ListDevicesByProfileIdentifier_ms12(ctx, r)
		if err != nil {
			return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileIdentifier: %v", err)
		}
		return &audience.ListDevicesByProfileIdentifierResponse{devices}, nil
	}

	if err := validateID(r.GetIdentifier()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: Identifier: %v", err)
	}

	devices, err := db.ListDevicesByProfileIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileIdentifier: %v", err)
	}
	return &audience.ListDevicesByProfileIdentifierResponse{devices}, nil
}

func (s *Server) GetDeviceSchema(ctx context.Context, r *audience.GetDeviceSchemaRequest) (*audience.GetDeviceSchemaResponse, error) {
	if r.GetAuthContext() == nil {
		return nil, status.Errorf(codes.Unauthenticated, "AuthContext: must be set")
	}

	db := s.db.Copy()
	defer db.Close()

	schema, err := db.GetDeviceSchemaByAccountId(ctx, int(r.GetAuthContext().GetAccountId()))
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceSchema: %v", err)
	}

	return &audience.GetDeviceSchemaResponse{Schema: schema}, nil
}

// Profiles

// GetProfile implements the corresponding rpc
func (s *Server) GetProfile(ctx context.Context, r *audience.GetProfileRequest) (*audience.GetProfileResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	p, err := db.GetProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfile: %v", err)
	}

	return &audience.GetProfileResponse{p}, nil
}

// CreateProfile implements the corresponding rpc
func (s *Server) CreateProfile(ctx context.Context, r *audience.CreateProfileRequest) (*audience.CreateProfileResponse, error) {
	if r.GetAuthContext() == nil || r.GetAuthContext().GetAccountId() == 0 {
		return nil, status.Error(codes.Unauthenticated, "AuthContext: must be set")
	}

	db := s.db.Copy()
	defer db.Close()

	p, err := db.CreateProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateProfile: %v", err)
	}
	s.notify.profileCreated(ctx, r.AuthContext.AccountId, p.GetId(), p.GetIdentifier())

	return &audience.CreateProfileResponse{p}, nil
}

// DeleteProfile implements the corresponding rpc
// TODO request should only take in
func (s *Server) DeleteProfile(ctx context.Context, r *audience.DeleteProfileRequest) (*audience.DeleteProfileResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	if err := db.DeleteProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteProfile: %v", err)
	}
	s.notify.profileDeleted(ctx, r.AuthContext.AccountId, r.ProfileId)

	return &audience.DeleteProfileResponse{}, nil
}

// GetProfileByDeviceId implements the corresponding rpc
func (s *Server) GetProfileByDeviceId(ctx context.Context, r *audience.GetProfileByDeviceIdRequest) (*audience.GetProfileByDeviceIdResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	p, err := db.GetProfileByDeviceId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByDeviceId: %v", err)
	}

	return &audience.GetProfileByDeviceIdResponse{p}, nil
}

// GetProfileByIdentifier implements the corresponding rpc
func (s *Server) GetProfileByIdentifier(ctx context.Context, r *audience.GetProfileByIdentifierRequest) (*audience.GetProfileByIdentifierResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	p, err := db.GetProfileByIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByIdentifier: %v", err)
	}

	return &audience.GetProfileByIdentifierResponse{p}, nil
}

// GetProfileSchema implements the corresponding rpc
func (s *Server) GetProfileSchema(ctx context.Context, r *audience.GetProfileSchemaRequest) (*audience.GetProfileSchemaResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	p, err := db.GetProfileSchema(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileSchema: %v", err)
	}

	return &audience.GetProfileSchemaResponse{p}, nil
}

// ListProfilesByIdsRequest implements the corresponding rpc
func (s *Server) ListProfilesByIds(ctx context.Context, r *audience.ListProfilesByIdsRequest) (*audience.ListProfilesByIdsResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	ps, err := db.ListProfilesByIds(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListProfilesByIds: %v", err)
	}

	return &audience.ListProfilesByIdsResponse{ps}, nil
}

// ListProfilesByIdentifiersRequest implements the corresponding rpc
func (s *Server) ListProfilesByIdentifiers(ctx context.Context, r *audience.ListProfilesByIdentifiersRequest) (*audience.ListProfilesByIdentifiersResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	ps, err := db.ListProfilesByIdentifiers(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListProfilesByIdentifiers: %v", err)
	}

	return &audience.ListProfilesByIdentifiersResponse{ps}, nil
}

// UpdateProfile implements the corresponding rpc
func (s *Server) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) (*audience.UpdateProfileResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := validateTags(r.GetAttributes()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: tags: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	schemaUpdated, err := db.UpdateProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfile: %v", err)
	}

	// We need to lookup the profile identifier for new worker
	profile, err := db.GetProfile(ctx, &audience.GetProfileRequest{AuthContext: r.AuthContext, ProfileId: r.GetProfileId()})
	s.notify.profileUpdated(ctx, r.AuthContext.AccountId, r.ProfileId, profile.Identifier)

	if schemaUpdated {
		s.notify.profileSchemaUpdated(ctx, r.AuthContext.AccountId)
	}

	return &audience.UpdateProfileResponse{}, nil
}

// UpdateProfileIdentifier implements the corresponding rpc
func (s *Server) UpdateProfileIdentifier(ctx context.Context, r *audience.UpdateProfileIdentifierRequest) (*audience.UpdateProfileIdentifierResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateProfileIdentifier(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfileIdentifier: %v", err)
	}
	s.notify.profileUpdated(ctx, r.AuthContext.AccountId, r.ProfileId, r.Identifier)

	return &audience.UpdateProfileIdentifierResponse{}, nil
}

//
// DynamicSegments
//

// GetDevicesTotalCount implements the corresponding rpc
func (s *Server) GetDevicesTotalCount(ctx context.Context, r *audience.GetDevicesTotalCountRequest) (*audience.GetDevicesTotalCountResponse, error) {
	if r.AuthContext == nil {
		return nil, status.Error(codes.Unauthenticated, "Unauthenticated")
	}

	count, err := s.index.GetDeviceTotalCount(ctx, int(r.AuthContext.GetAccountId()))
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "index.GetDevicesTotalCount: %v", err)
	}
	return &audience.GetDevicesTotalCountResponse{count}, nil
}

// GetProfilesTotalCount implements the corresponding rpc
func (s *Server) GetProfilesTotalCount(ctx context.Context, r *audience.GetProfilesTotalCountRequest) (*audience.GetProfilesTotalCountResponse, error) {
	if r.AuthContext == nil {
		return nil, status.Error(codes.Unauthenticated, "Unauthenticated")
	}

	count, err := s.index.GetProfileTotalCount(ctx, int(r.AuthContext.GetAccountId()))
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "index.GetDevicesTotalCount: %v", err)
	}
	return &audience.GetProfilesTotalCountResponse{count}, nil
}

// CreateDynamicSegment implements the corresponding rpc
func (s *Server) CreateDynamicSegment(ctx context.Context, r *audience.CreateDynamicSegmentRequest) (*audience.CreateDynamicSegmentResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	ds, err := db.CreateDynamicSegment(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateDynamicSegment: %v", err)
	}

	return &audience.CreateDynamicSegmentResponse{
		Segment: ds,
	}, nil
}

// GetDynamicSegmentById implements the corresponding rpc
func (s *Server) GetDynamicSegmentById(ctx context.Context, r *audience.GetDynamicSegmentByIdRequest) (*audience.GetDynamicSegmentByIdResponse, error) {
	if err := validateID(r.GetSegmentId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: SegmentId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	ds, err := db.GetDynamicSegmentById(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDynamicSegmentById: %v", err)
	}

	return &audience.GetDynamicSegmentByIdResponse{
		Segment: ds,
	}, nil
}

// UpdateDynamicSegmentTitle implements the corresponding rpc
func (s *Server) UpdateDynamicSegmentTitle(ctx context.Context, r *audience.UpdateDynamicSegmentTitleRequest) (*audience.UpdateDynamicSegmentTitleResponse, error) {
	if err := validateID(r.GetSegmentId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: SegmentId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDynamicSegmentTitle(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDynamicSegmentTitle: %v", err)
	}

	return &audience.UpdateDynamicSegmentTitleResponse{}, nil
}

// UpdateDynamicSegmentPredicates implements the corresponding rpc
func (s *Server) UpdateDynamicSegmentPredicates(ctx context.Context, r *audience.UpdateDynamicSegmentPredicatesRequest) (*audience.UpdateDynamicSegmentPredicatesResponse, error) {
	if err := validateID(r.GetSegmentId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: SegmentId: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDynamicSegmentPredicates(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDynamicSegmentPredicates: %v", err)
	}

	return &audience.UpdateDynamicSegmentPredicatesResponse{}, nil
}

// UpdateDynamicSegmentArchiveStatus implements the corresponding rpc
func (s *Server) UpdateDynamicSegmentArchiveStatus(ctx context.Context, r *audience.UpdateDynamicSegmentArchiveStatusRequest) (*audience.UpdateDynamicSegmentArchiveStatusResponse, error) {
	if err := validateID(r.GetSegmentId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: SegmentId: %v", err)
	}
	db := s.db.Copy()
	defer db.Close()

	if err := db.UpdateDynamicSegmentArchiveStatus(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDynamicSegmentArchiveStatus: %v", err)
	}

	return &audience.UpdateDynamicSegmentArchiveStatusResponse{}, nil
}

// ListDynamicSegments implements the corresponding rpc
func (s *Server) ListDynamicSegments(ctx context.Context, r *audience.ListDynamicSegmentsRequest) (*audience.ListDynamicSegmentsResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	dss, err := db.ListDynamicSegments(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDynamicSegments: %v", err)
	}
	return &audience.ListDynamicSegmentsResponse{
		Segments: dss,
	}, nil
}

func (s *Server) Query(ctx context.Context, r *audience.QueryRequest) (*audience.QueryResponse, error) {
	if r.AuthContext == nil {
		return nil, status.Error(codes.Unauthenticated, "Unauthenticated")
	}
	resp, err := s.index.Query(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "Index.Query: %v", err)
	}

	return resp, nil
}

func (s *Server) IsInDynamicSegment(ctx context.Context, r *audience.IsInDynamicSegmentRequest) (*audience.IsInDynamicSegmentResponse, error) {

	segmentLookupRequest := &audience.GetDynamicSegmentByIdRequest{
		AuthContext: r.GetAuthContext(),
		SegmentId:   r.GetSegmentId(),
	}

	db := s.db.Copy()
	defer db.Close()

	segment, err := db.GetDynamicSegmentById(ctx, segmentLookupRequest)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDynamicSegmentById: %v", err)
	}

	if r.GetDevice() == nil {
		return nil, status.Error(codes.InvalidArgument, "Device must be defined")
	}

	if r.GetProfile() == nil {
		return nil, status.Error(codes.InvalidArgument, "Profile must be defined")
	}

	ok, err := predicates.IsInDynamicSegment(segment, r.GetDevice(), r.GetProfile())

	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "predicates.IsInDynamicSegment: %v", err)
	}

	return &audience.IsInDynamicSegmentResponse{Yes: ok}, nil
}

func (s *Server) DeviceIsInDynamicSegment(ctx context.Context, r *audience.DeviceIsInDynamicSegmentRequest) (*audience.DeviceIsInDynamicSegmentResponse, error) {

	segmentLookupRequest := &audience.GetDynamicSegmentByIdRequest{
		AuthContext: r.GetAuthContext(),
		SegmentId:   r.GetSegmentId(),
	}

	db := s.db.Copy()
	defer db.Close()

	segment, err := db.GetDynamicSegmentById(ctx, segmentLookupRequest)
	if err != nil {
		return nil, err
	}

	deviceLookupRequest := &audience.GetDeviceRequest{
		AuthContext: r.GetAuthContext(),
		DeviceId:    r.GetDeviceId(),
	}

	device, err := db.GetDevice(ctx, deviceLookupRequest)
	if err != nil {
		return nil, err
	}

	profile, err := db.GetProfile(ctx, &audience.GetProfileRequest{AuthContext: r.GetAuthContext(), ProfileId: device.GetProfileId()})
	if err != nil {
		return nil, err
	}

	ok, err := predicates.IsInDynamicSegment(segment, device, profile)

	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "predicates.IsInDynamicSegment: %v", err)
	}

	return &audience.DeviceIsInDynamicSegmentResponse{Yes: ok}, nil
}

// String Field Suggestions

// GetFieldSuggestion implements the corresponding rpc
func (s *Server) GetFieldSuggestion(ctx context.Context, r *audience.GetFieldSuggestionRequest) (*audience.GetFieldSuggestionResponse, error) {
	if r.AuthContext == nil {
		return nil, status.Error(codes.Unauthenticated, "Unauthenticated")
	}

	suggestions, err := s.index.GetFieldSuggestion(ctx, r)

	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "Index.GetFieldSuggestion: %v", err)
	}

	return suggestions, nil

}

// Validations

func validateID(id string) error {
	if id == "" {
		return errBlank
	}

	return nil
}

func validateTags(attrs map[string]*audience.ValueUpdates) error {
	valueUpdates, ok := attrs["tags"]
	if !ok {
		return nil
	}

	if err := audience.IsStringArray(valueUpdates); err != nil {
		return errors.Wrap(err, "IsStringArray")
	}

	return nil
}

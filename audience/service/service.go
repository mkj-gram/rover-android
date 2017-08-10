package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

// ensure the interface is implemented
var _ audience.AudienceServer = (*Server)(nil)

var (
	// Register provides a convenient wrapper around generated function
	Register = audience.RegisterAudienceServer
)

type (
	// Server implements the audience service grpc interface
	Server struct {
		db *mongodb.DB
	}

	// Option is a Server option type
	Option func(s *Server)
)

// New creates new Server instance with all the options provided
func New(db *mongodb.DB, options ...Option) *Server {
	srv := &Server{
		db: db,
	}

	for _, opt := range options {
		opt(srv)
	}

	return srv
}

// Devices

// GetDevice implements the corresponding rpc
func (s *Server) GetDevice(ctx context.Context, r *audience.GetDeviceRequest) (*audience.GetDeviceResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	d, err := s.db.GetDevice(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDevice: %v", err)
	}

	return &audience.GetDeviceResponse{d}, nil
}

// GetDeviceByPushToken implements the corresponding rpc
func (s *Server) GetDeviceByPushToken(ctx context.Context, r *audience.GetDeviceByPushTokenRequest) (*audience.GetDeviceByPushTokenResponse, error) {
	if err := validateID(r.GetDeviceTokenKey()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceTokenKey: %v", err)
	}

	d, err := s.db.GetDeviceByPushToken(ctx, r)
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

	if err := s.db.CreateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateDevice: %v", err)
	}
	return &audience.CreateDeviceResponse{}, nil
}

// UpdateDevice implements the corresponding rpc
func (s *Server) UpdateDevice(ctx context.Context, r *audience.UpdateDeviceRequest) (*audience.UpdateDeviceResponse, error) {
	if err := s.db.UpdateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevice: %v", err)
	}
	return &audience.UpdateDeviceResponse{}, nil
}

// UpdateDevice implements the corresponding rpc
func (s *Server) UpdateDeviceTestProperty(ctx context.Context, r *audience.UpdateDeviceTestPropertyRequest) (*audience.UpdateDeviceTestPropertyResponse, error) {
	if err := s.db.UpdateDeviceTestProperty(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceTestProperty: %v", err)
	}
	return &audience.UpdateDeviceTestPropertyResponse{}, nil
}

// DeleteDevice implements the corresponding rpc
func (s *Server) DeleteDevice(ctx context.Context, r *audience.DeleteDeviceRequest) (*audience.DeleteDeviceResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	if err := s.db.DeleteDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteDevice: %v", err)
	}
	return &audience.DeleteDeviceResponse{}, nil
}

// SetDeviceProfile implements the corresponding rpc
func (s *Server) SetDeviceProfile(ctx context.Context, r *audience.SetDeviceProfileRequest) (*audience.SetDeviceProfileResponse, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := s.db.SetDeviceProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.SetDeviceProfile: %v", err)
	}
	return &audience.SetDeviceProfileResponse{}, nil
}

// UpdateDevicePushToken implements the corresponding rpc
func (s *Server) UpdateDevicePushToken(ctx context.Context, r *audience.UpdateDevicePushTokenRequest) (*audience.UpdateDevicePushTokenResponse, error) {
	if err := s.db.UpdateDevicePushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevicePushToken: %v", err)
	}
	return &audience.UpdateDevicePushTokenResponse{}, nil
}

// UpdateDeviceUnregisterPushToken implements the corresponding rpc
func (s *Server) UpdateDeviceUnregisterPushToken(ctx context.Context, r *audience.UpdateDeviceUnregisterPushTokenRequest) (*audience.UpdateDeviceUnregisterPushTokenResponse, error) {
	if err := s.db.UpdateDeviceUnregisterPushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceUnregisterPushToken: %v", err)
	}
	return &audience.UpdateDeviceUnregisterPushTokenResponse{}, nil
}

// UpdateDeviceLocation implements the corresponding rpc
func (s *Server) UpdateDeviceLocation(ctx context.Context, r *audience.UpdateDeviceLocationRequest) (*audience.UpdateDeviceLocationResponse, error) {
	if err := s.db.UpdateDeviceLocation(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceLocation: %v", err)
	}
	return &audience.UpdateDeviceLocationResponse{}, nil
}

// UpdateDeviceGeofenceMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceGeofenceMonitoring(ctx context.Context, r *audience.UpdateDeviceGeofenceMonitoringRequest) (*audience.UpdateDeviceGeofenceMonitoringResponse, error) {
	if err := s.db.UpdateDeviceGeofenceMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceGeofenceMonitoring: %v", err)
	}
	return &audience.UpdateDeviceGeofenceMonitoringResponse{}, nil
}

// UpdateDeviceIBeaconMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceIBeaconMonitoring(ctx context.Context, r *audience.UpdateDeviceIBeaconMonitoringRequest) (*audience.UpdateDeviceIBeaconMonitoringResponse, error) {
	if err := s.db.UpdateDeviceIBeaconMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceIBeaconMonitoring: %v", err)
	}
	return &audience.UpdateDeviceIBeaconMonitoringResponse{}, nil
}

func (s *Server) ListDevicesByProfileId(ctx context.Context, r *audience.ListDevicesByProfileIdRequest) (*audience.ListDevicesByProfileIdResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	devices, err := s.db.ListDevicesByProfileId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileId: %v", err)
	}
	return &audience.ListDevicesByProfileIdResponse{devices}, nil
}

func (s *Server) ListDevicesByProfileIdentifier(ctx context.Context, r *audience.ListDevicesByProfileIdentifierRequest) (*audience.ListDevicesByProfileIdentifierResponse, error) {
	if err := validateID(r.GetIdentifier()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: Identifier: %v", err)
	}

	devices, err := s.db.ListDevicesByProfileIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileIdentifier: %v", err)
	}
	return &audience.ListDevicesByProfileIdentifierResponse{devices}, nil
}

// Profiles

// GetProfile implements the corresponding rpc
func (s *Server) GetProfile(ctx context.Context, r *audience.GetProfileRequest) (*audience.GetProfileResponse, error) {
	p, err := s.db.GetProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfile: %v", err)
	}

	return &audience.GetProfileResponse{p}, nil
}

// CreateProfile implements the corresponding rpc
func (s *Server) CreateProfile(ctx context.Context, r *audience.CreateProfileRequest) (*audience.CreateProfileResponse, error) {
	if r.GetAuthContext().GetAccountId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "AccountId: unset")
	}

	p, err := s.db.CreateProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateProfile: %v", err)
	}

	return &audience.CreateProfileResponse{p}, nil
}

// DeleteProfile implements the corresponding rpc
func (s *Server) DeleteProfile(ctx context.Context, r *audience.DeleteProfileRequest) (*audience.DeleteProfileResponse, error) {
	if err := s.db.DeleteProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteProfile: %v", err)
	}

	return &audience.DeleteProfileResponse{}, nil
}

// GetProfileByDeviceId implements the corresponding rpc
func (s *Server) GetProfileByDeviceId(ctx context.Context, r *audience.GetProfileByDeviceIdRequest) (*audience.GetProfileByDeviceIdResponse, error) {
	p, err := s.db.GetProfileByDeviceId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByDeviceId: %v", err)
	}

	return &audience.GetProfileByDeviceIdResponse{p}, nil
}

// GetProfileByIdentifier implements the corresponding rpc
func (s *Server) GetProfileByIdentifier(ctx context.Context, r *audience.GetProfileByIdentifierRequest) (*audience.GetProfileByIdentifierResponse, error) {
	p, err := s.db.GetProfileByIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByIdentifier: %v", err)
	}

	return &audience.GetProfileByIdentifierResponse{p}, nil
}

// GetProfileSchema implements the corresponding rpc
func (s *Server) GetProfileSchema(ctx context.Context, r *audience.GetProfileSchemaRequest) (*audience.GetProfileSchemaResponse, error) {
	p, err := s.db.GetProfileSchema(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileSchema: %v", err)
	}

	return &audience.GetProfileSchemaResponse{p}, nil
}

// ListProfilesByIdsRequest implements the corresponding rpc
func (s *Server) ListProfilesByIds(ctx context.Context, r *audience.ListProfilesByIdsRequest) (*audience.ListProfilesByIdsResponse, error) {
	ps, err := s.db.ListProfilesByIds(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListProfilesByIds: %v", err)
	}

	return &audience.ListProfilesByIdsResponse{ps}, nil
}

// UpdateProfile implements the corresponding rpc
func (s *Server) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) (*audience.UpdateProfileResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := validateTags(r.GetAttributes()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: tags: %v", err)
	}

	if err := s.db.UpdateProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfile: %v", err)
	}

	return &audience.UpdateProfileResponse{}, nil
}

// UpdateProfileIdentifier implements the corresponding rpc
func (s *Server) UpdateProfileIdentifier(ctx context.Context, r *audience.UpdateProfileIdentifierRequest) (*audience.UpdateProfileIdentifierResponse, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := s.db.UpdateProfileIdentifier(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfileIdentifier: %v", err)
	}

	return &audience.UpdateProfileIdentifierResponse{}, nil
}

//
// DynamicSegments
//

// CreateDynamicSegment implements the corresponding rpc
func (s *Server) CreateDynamicSegment(ctx context.Context, r *audience.CreateDynamicSegmentRequest) (*audience.CreateDynamicSegmentResponse, error) {
	return &audience.CreateDynamicSegmentResponse{}, status.Error(codes.Unimplemented, "TODO:")
}

// GetDynamicSegmentById implements the corresponding rpc
func (s *Server) GetDynamicSegmentById(ctx context.Context, r *audience.GetDynamicSegmentByIdRequest) (*audience.GetDynamicSegmentByIdResponse, error) {
	return &audience.GetDynamicSegmentByIdResponse{}, status.Error(codes.Unimplemented, "TODO:")
}

// UpdateDynamicSegmentTitle implements the corresponding rpc
func (s *Server) UpdateDynamicSegmentTitle(ctx context.Context, r *audience.UpdateDynamicSegmentTitleRequest) (*audience.UpdateDynamicSegmentTitleResponse, error) {
	return &audience.UpdateDynamicSegmentTitleResponse{}, status.Error(codes.Unimplemented, "TODO:")
}

// UpdateDynamicSegmentPredicates implements the corresponding rpc
func (s *Server) UpdateDynamicSegmentPredicates(ctx context.Context, r *audience.UpdateDynamicSegmentPredicatesRequest) (*audience.UpdateDynamicSegmentPredicatesResponse, error) {
	return &audience.UpdateDynamicSegmentPredicatesResponse{}, status.Error(codes.Unimplemented, "TODO:")
}

// ArchiveDynamicSegmentById implements the corresponding rpc
func (s *Server) ArchiveDynamicSegmentById(ctx context.Context, r *audience.ArchiveDynamicSegmentByIdRequest) (*audience.ArchiveDynamicSegmentByIdResponse, error) {
	return &audience.ArchiveDynamicSegmentByIdResponse{}, status.Error(codes.Unimplemented, "TODO:")
}

// ListDynamicSegments implements the corresponding rpc
func (s *Server) ListDynamicSegments(ctx context.Context, r *audience.ListDynamicSegmentsRequest) (*audience.ListDynamicSegmentsResponse, error) {
	return &audience.ListDynamicSegmentsResponse{}, status.Error(codes.Unimplemented, "TODO:")
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

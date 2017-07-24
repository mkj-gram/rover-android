package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
)

// ensure the interface is implemented
var _ audience.AudienceServer = (*Server)(nil)

var (
	// Register provides a convenient wrapper around generated function
	Register = audience.RegisterAudienceServer

	// singleton, reused for RPCs with no return value
	emptyResp = new(empty.Empty)
)

type (
	// Server implements the audience service grpc interface
	Server struct {
		db DB
	}

	// DB interface the service is expecting
	DB interface {
		// Profiles
		CreateProfile(context.Context, *audience.CreateProfileRequest) (*audience.Profile, error)
		DeleteProfile(context.Context, *audience.DeleteProfileRequest) error

		UpdateProfile(context.Context, *audience.UpdateProfileRequest) error
		UpdateProfileIdentifier(context.Context, *audience.UpdateProfileIdentifierRequest) error

		GetProfileByDeviceId(context.Context, *audience.GetProfileByDeviceIdRequest) (*audience.Profile, error)
		GetProfileByIdentifier(context.Context, *audience.GetProfileByIdentifierRequest) (*audience.Profile, error)

		ListProfilesByIds(context.Context, *audience.ListProfilesByIdsRequest) ([]*audience.Profile, error)

		// Profiles Schema
		GetProfileSchema(context.Context, *audience.GetProfileSchemaRequest) (*audience.ProfileSchema, error)

		// Devices
		GetDevice(context.Context, *audience.GetDeviceRequest) (*audience.Device, error)
		GetDeviceByPushToken(context.Context, *audience.GetDeviceByPushTokenRequest) (*audience.Device, error)

		CreateDevice(context.Context, *audience.CreateDeviceRequest) error

		UpdateDevice(context.Context, *audience.UpdateDeviceRequest) error
		UpdateDevicePushToken(context.Context, *audience.UpdateDevicePushTokenRequest) error
		UpdateDeviceUnregisterPushToken(context.Context, *audience.UpdateDeviceUnregisterPushTokenRequest) error
		UpdateDeviceLocation(context.Context, *audience.UpdateDeviceLocationRequest) error
		UpdateDeviceIBeaconMonitoring(context.Context, *audience.UpdateDeviceIBeaconMonitoringRequest) error
		UpdateDeviceGeofenceMonitoring(context.Context, *audience.UpdateDeviceGeofenceMonitoringRequest) error

		SetDeviceProfile(context.Context, *audience.SetDeviceProfileRequest) error
		DeleteDevice(context.Context, *audience.DeleteDeviceRequest) error

		ListDevicesByProfileId(context.Context, *audience.ListDevicesByProfileIdRequest) ([]*audience.Device, error)
	}

	// Option is a Server option type
	Option func(s *Server)
)

// New creates new Server instance with all the options provided
func New(db DB, options ...Option) *Server {
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
func (s *Server) GetDevice(ctx context.Context, r *audience.GetDeviceRequest) (*audience.Device, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	d, err := s.db.GetDevice(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDevice: %v", err)
	}

	return d, nil
}

// GetDeviceByPushToken implements the corresponding rpc
func (s *Server) GetDeviceByPushToken(ctx context.Context, r *audience.GetDeviceByPushTokenRequest) (*audience.Device, error) {
	if err := validateID(r.GetDeviceTokenKey()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceTokenKey: %v", err)
	}

	d, err := s.db.GetDeviceByPushToken(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDeviceByPushToken: %v", err)
	}

	return d, nil
}

// CreateDevice implements the corresponding rpc
func (s *Server) CreateDevice(ctx context.Context, r *audience.CreateDeviceRequest) (*empty.Empty, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}

	if err := s.db.CreateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateDevice: %v", err)
	}
	return emptyResp, nil
}

// UpdateDevice implements the corresponding rpc
func (s *Server) UpdateDevice(ctx context.Context, r *audience.UpdateDeviceRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevice: %v", err)
	}
	return emptyResp, nil
}

// DeleteDevice implements the corresponding rpc
func (s *Server) DeleteDevice(ctx context.Context, r *audience.DeleteDeviceRequest) (*empty.Empty, error) {
	if r.GetDeviceId() == "" {
		return nil, status.Error(codes.InvalidArgument, "db.DeleteDevice: Id: invalid")
	}

	if err := s.db.DeleteDevice(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteDevice: %v", err)
	}
	return emptyResp, nil
}

// SetDeviceProfile implements the corresponding rpc
func (s *Server) SetDeviceProfile(ctx context.Context, r *audience.SetDeviceProfileRequest) (*empty.Empty, error) {
	if err := validateID(r.GetDeviceId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: DeviceId: %v", err)
	}
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := s.db.SetDeviceProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.SetDeviceProfile: %v", err)
	}
	return emptyResp, nil
}

// UpdateDevicePushToken implements the corresponding rpc
func (s *Server) UpdateDevicePushToken(ctx context.Context, r *audience.UpdateDevicePushTokenRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDevicePushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDevicePushToken: %v", err)
	}
	return emptyResp, nil
}

// UpdateDeviceUnregisterPushToken implements the corresponding rpc
func (s *Server) UpdateDeviceUnregisterPushToken(ctx context.Context, r *audience.UpdateDeviceUnregisterPushTokenRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDeviceUnregisterPushToken(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceUnregisterPushToken: %v", err)
	}
	return emptyResp, nil
}

// UpdateDeviceLocation implements the corresponding rpc
func (s *Server) UpdateDeviceLocation(ctx context.Context, r *audience.UpdateDeviceLocationRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDeviceLocation(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceLocation: %v", err)
	}
	return emptyResp, nil
}

// UpdateDeviceGeofenceMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceGeofenceMonitoring(ctx context.Context, r *audience.UpdateDeviceGeofenceMonitoringRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDeviceGeofenceMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceGeofenceMonitoring: %v", err)
	}
	return emptyResp, nil
}

// UpdateDeviceIBeaconMonitoring implements the corresponding rpc
func (s *Server) UpdateDeviceIBeaconMonitoring(ctx context.Context, r *audience.UpdateDeviceIBeaconMonitoringRequest) (*empty.Empty, error) {
	if err := s.db.UpdateDeviceIBeaconMonitoring(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateDeviceIBeaconMonitoring: %v", err)
	}
	return emptyResp, nil
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

// Profiles

// CreateProfile implements the corresponding rpc
func (s *Server) CreateProfile(ctx context.Context, r *audience.CreateProfileRequest) (*audience.Profile, error) {
	if r.GetAuthContext().GetAccountId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "AccountId: unset")
	}

	ap, err := s.db.CreateProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateProfile: %v", err)
	}

	return ap, nil
}

// DeleteProfile implements the corresponding rpc
func (s *Server) DeleteProfile(ctx context.Context, r *audience.DeleteProfileRequest) (*empty.Empty, error) {
	if err := s.db.DeleteProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.DeleteProfile: %v", err)
	}

	return emptyResp, nil
}

// GetProfileByDeviceId implements the corresponding rpc
func (s *Server) GetProfileByDeviceId(ctx context.Context, r *audience.GetProfileByDeviceIdRequest) (*audience.Profile, error) {
	p, err := s.db.GetProfileByDeviceId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByDeviceId: %v", err)
	}

	return p, nil
}

// GetProfileByIdentifier implements the corresponding rpc
func (s *Server) GetProfileByIdentifier(ctx context.Context, r *audience.GetProfileByIdentifierRequest) (*audience.Profile, error) {
	p, err := s.db.GetProfileByIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileByIdentifier: %v", err)
	}

	return p, nil
}

// GetProfileSchema implements the corresponding rpc
func (s *Server) GetProfileSchema(ctx context.Context, r *audience.GetProfileSchemaRequest) (*audience.ProfileSchema, error) {
	p, err := s.db.GetProfileSchema(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfileSchema: %v", err)
	}

	return p, nil
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
func (s *Server) UpdateProfile(ctx context.Context, r *audience.UpdateProfileRequest) (*empty.Empty, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := validateTags(r.GetAttributes()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: tags: %v", err)
	}

	if err := s.db.UpdateProfile(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfile: %v", err)
	}

	return emptyResp, nil
}

// UpdateProfileIdentifier implements the corresponding rpc
func (s *Server) UpdateProfileIdentifier(ctx context.Context, r *audience.UpdateProfileIdentifierRequest) (*empty.Empty, error) {
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	if err := s.db.UpdateProfileIdentifier(ctx, r); err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.UpdateProfileIdentifier: %v", err)
	}

	return emptyResp, nil
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

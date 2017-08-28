package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/mockdata"
	"github.com/roverplatform/rover/audience/service/mongodb"
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
	}
)

// New creates new Server instance with all the options provided
func New(db *mongodb.DB, notifier Notifier) *Server {
	return &Server{
		db: db,
		notify: &serviceNotify{
			Notifier: notifier,
		},
	}
}

//
// Counter Caches
//

// GetDevicesTotalCount implements the corresponding rpc
func (s *Server) GetDevicesTotalCount(ctx context.Context, r *audience.GetDevicesTotalCountRequest) (*audience.GetDevicesTotalCountResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	val, err := db.GetDevicesTotalCount(ctx, r.GetAuthContext().GetAccountId())
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetDevicesTotalCount: %v", err)
	}
	return &audience.GetDevicesTotalCountResponse{val}, nil
}

// GetProfilesTotalCount implements the corresponding rpc
func (s *Server) GetProfilesTotalCount(ctx context.Context, r *audience.GetProfilesTotalCountRequest) (*audience.GetProfilesTotalCountResponse, error) {
	db := s.db.Copy()
	defer db.Close()

	val, err := db.GetProfilesTotalCount(ctx, r.GetAuthContext().GetAccountId())
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.GetProfilesTotalCount: %v", err)
	}
	return &audience.GetProfilesTotalCountResponse{val}, nil
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

// UpdateDevice implements the corresponding rpc
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
	if err := validateID(r.GetProfileId()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: ProfileId: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

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

	devices, err := db.ListDevicesByProfileId(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileId: %v", err)
	}

	return &audience.ListDevicesByProfileIdResponse{devices}, nil
}

func (s *Server) ListDevicesByProfileIdentifier(ctx context.Context, r *audience.ListDevicesByProfileIdentifierRequest) (*audience.ListDevicesByProfileIdentifierResponse, error) {
	if err := validateID(r.GetIdentifier()); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Validation: Identifier: %v", err)
	}

	db := s.db.Copy()
	defer db.Close()

	devices, err := db.ListDevicesByProfileIdentifier(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.ListDevicesByProfileIdentifier: %v", err)
	}
	return &audience.ListDevicesByProfileIdentifierResponse{devices}, nil
}

func (s *Server) GetDeviceSchema(ctx context.Context, r *audience.GetDeviceSchemaRequest) (*audience.GetDeviceSchemaResponse, error) {
	if r.GetAuthContext() == nil {
		return &audience.GetDeviceSchemaResponse{
			Schema: &audience.DeviceSchema{
				Attributes: nil,
			},
		}, nil
	}

	return &audience.GetDeviceSchemaResponse{
		Schema: &audience.DeviceSchema{
			Attributes: hardcodedDeviceSchema(r.GetAuthContext().GetAccountId()),
		},
	}, nil
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
	if r.GetAuthContext().GetAccountId() == 0 {
		return nil, status.Error(codes.InvalidArgument, "AccountId: unset")
	}

	db := s.db.Copy()
	defer db.Close()

	p, err := db.CreateProfile(ctx, r)
	if err != nil {
		return nil, status.Errorf(ErrorToStatus(errors.Cause(err)), "db.CreateProfile: %v", err)
	}
	s.notify.profileCreated(ctx, r.AuthContext.AccountId, p.GetId())

	return &audience.CreateProfileResponse{p}, nil
}

// DeleteProfile implements the corresponding rpc
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

	s.notify.profileUpdated(ctx, r.AuthContext.AccountId, r.ProfileId)
	if schemaUpdated {
		s.notify.schemaUpdated(ctx, r.AuthContext.AccountId)
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
	s.notify.profileUpdated(ctx, r.AuthContext.AccountId, r.ProfileId)

	return &audience.UpdateProfileIdentifierResponse{}, nil
}

//
// DynamicSegments
//

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

	// TODO: remove mock data and convert predicates to elasticsearch queries

	if r.AuthContext == nil {
		return nil, status.Error(codes.Unauthenticated, "Unauthenticated")
	}

	// Pick from our list of mock data
	switch typ := r.GetIterator().(type) {
	case *audience.QueryRequest_CursorIterator_:
		return s.queryWithCursorIterator(ctx, r)
	case *audience.QueryRequest_PageIterator_:
		return s.queryWithPageIterator(ctx, r)
	default:
		return nil, status.Errorf(codes.InvalidArgument, "Got type %T", typ)

	}

}

func (s *Server) queryWithCursorIterator(ctx context.Context, r *audience.QueryRequest) (*audience.QueryResponse, error) {
	return mockdata.Generate(r.GetAuthContext().GetAccountId(), 100), nil
}

func (s *Server) queryWithPageIterator(ctx context.Context, r *audience.QueryRequest) (*audience.QueryResponse, error) {
	return mockdata.Generate(r.GetAuthContext().GetAccountId(), r.GetPageIterator().GetSize()), nil
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

package service

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/roverplatform/rover/apis/go/audience/v1"
)

// ensure the interface is implemented
var _ audience.AudienceServer = (*Server)(nil)

var (
	Register = audience.RegisterAudienceServer
)

func New(options ...Option) *Server {
	server := &Server{}
	for _, opt := range options {
		opt(server)
	}

	return server
}

type (
	Server struct {
		Logger

		DB
		Index
	}

	Option func(s *Server)

	// Logger represents logging facility
	Logger interface {
		Debugf(string, ...interface{})
		Infof(string, ...interface{})
		Errorf(string, ...interface{})
	}

	DB interface{}

	// Searching and indexing methods
	Index interface{}
)

func WithDB(db DB) Option {
	return func(s *Server) {
		s.DB = db
	}
}

func (s *Server) CreateProfile(context.Context, *audience.CreateProfileRequest) (*audience.Profile, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) DeleteProfile(context.Context, *audience.DeleteProfileRequest) (*audience.Profile, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) UpdateProfile(context.Context, *audience.UpdateProfileRequest) (*audience.Profile, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) GetProfileByDeviceId(context.Context, *audience.GetProfileByDeviceIdRequest) (*audience.Profile, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) GetProfileSchema(context.Context, *audience.GetProfileSchemaRequest) (*audience.ProfileSchema, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) CreateDevice(context.Context, *audience.CreateDeviceRequest) (*audience.Device, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) DeleteDevice(context.Context, *audience.DeleteDeviceRequest) (*audience.Device, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) PutDevice(context.Context, *audience.PutDeviceRequest) (*audience.Device, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) SetDevicePushToken(context.Context, *audience.SetDevicePushTokenRequest) (*empty.Empty, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

func (s *Server) SetDeviceProfile(context.Context, *audience.SetDeviceProfileRequest) (*audience.Device, error) {
	return nil, grpc.Errorf(codes.Unimplemented, "Unimplemented")
}

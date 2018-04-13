package grpc

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/notification/pubsub"
	"github.com/roverplatform/rover/notification/scylla"
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *NotificationServer) SendCampaignNotification(ctx context.Context, req *notification.SendCampaignNotificationRequest) (*notification.SendCampaignNotificationResponse, error) {

	var (
		campaignID = req.GetCampaignId()
		accountID  = req.GetAuthContext().GetAccountId()
		messages   = req.GetMessages()
	)

	settings, err := s.DB.NotificationSettingsStore().OneById(ctx, campaignID)
	if err != nil && err != scylla.ErrNotFound {
		return nil, errors.Wrap(err, "OneById")
	}

	if settings == nil {
		if err = s.DB.NotificationSettingsStore().Create(ctx, notificationSettingsFromProto(req)); err != nil {
			if _, ok := err.(*scylla.ValidationError); ok {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
			return nil, errors.Wrap(err, "Create")
		}
	}

	type result = notification.SendCampaignNotificationResponse_Result

	var (
		pubsubMessages = make([]pubsub.Message, len(messages))

		results = make([]*result, len(messages))
	)

	for i, message := range messages {
		pubsubMessages[i] = pubsubMessageFromProto(accountID, campaignID, message)
	}

	for i, err := range s.Publisher.Publish(ctx, pubsubMessages...) {
		if err == nil {
			results[i] = &result{}
		} else {
			results[i] = &result{Error: true, Message: err.Error()}
		}
	}

	return &notification.SendCampaignNotificationResponse{
		Results: results,
	}, nil
}

func pubsubMessageFromProto(accountID int32, campaignID int32, m *notification.SendCampaignNotificationRequest_Message) *pubsub.PushMessage {
	return &pubsub.PushMessage{
		CampaignID:        int(campaignID),
		NotificationBody:  m.GetNotificationBody(),
		NotificationTitle: m.GetNotificationTitle(),

		Device: pubsub.Device{
			AccountID:            int(accountID),
			ID:                   m.GetDeviceId(),
			PushToken:            m.GetDevicePushToken(),
			PushTokenEnvironment: m.GetDevicePushTokenEnvironment().String(),
			AppNamespace:         m.GetDeviceAppNamespace(),
			BadgeCount:           int(m.GetDeviceBadgeCount()),
			OsName:               m.GetOsName(),
			SdkVersion: pubsub.Version{
				Major:    m.GetSdkVersion().GetMajor(),
				Minor:    m.GetSdkVersion().GetMinor(),
				Revision: m.GetSdkVersion().GetRevision(),
			},
		},
	}
}

func attachmentTypeFromProto(in notification.NotificationAttachmentType_Enum) scylla.AttachmentType {
	switch in {
	case notification.NotificationAttachmentType_UNKNOWN:
		return scylla.AttachmentType_NONE
	case notification.NotificationAttachmentType_AUDIO:
		return scylla.AttachmentType_AUDIO
	case notification.NotificationAttachmentType_IMAGE:
		return scylla.AttachmentType_IMAGE
	case notification.NotificationAttachmentType_VIDEO:
		return scylla.AttachmentType_VIDEO
	default:
		panic(errors.Errorf("unknown attachment type: %s", in.String()))
	}
}

func notificationSettingsFromProto(in *notification.SendCampaignNotificationRequest) scylla.NotificationSettings {

	return scylla.NotificationSettings{
		CampaignId: in.CampaignId,
		AccountID:  in.GetAuthContext().GetAccountId(),

		ExperienceId: in.GetExperienceId(),

		AttachmentType: attachmentTypeFromProto(in.GetNotificationAttachmentType()),
		AttachmentUrl:  in.GetNotificationAttachmentUrl(),

		TapBehaviorType:             scylla.TapBehaviorType(in.GetNotificationTapBehaviorType().String()),
		TapBehaviorPresentationType: scylla.TapBehaviorPresentationType(in.GetNotificationTapBehaviorPresentationType().String()),
		TapBehaviorUrl:              in.GetNotificationTapBehaviorUrl(),

		IosContentAvailable:   in.GetNotificationIosContentAvailable(),
		IosMutableContent:     in.GetNotificationIosMutableContent(),
		IosSound:              in.GetNotificationIosSound(),
		IosCategoryIdentifier: in.GetNotificationIosCategoryIdentifier(),
		IosThreadIdentifier:   in.GetNotificationIosThreadIdentifier(),

		AndroidChannelId: in.GetNotificationAndroidChannelId(),
		AndroidSound:     in.GetNotificationAndroidSound(),
		AndroidTag:       in.GetNotificationAndroidTag(),

		Expiration: in.GetNotificationExpiration(),

		Attributes: in.GetNotificationAttributes(),

		AlertOptionPushNotification:   in.GetNotificationAlertOptionPushNotification(),
		AlertOptionNotificationCenter: in.GetNotificationAlertOptionNotificationCenter(),
		AlertOptionBadgeNumber:        in.GetNotificationAlertOptionBadgeNumber(),
	}
}

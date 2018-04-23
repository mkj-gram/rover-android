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

func (s *NotificationServer) ListNotifications(ctx context.Context, req *notification.ListNotificationsRequest) (*notification.ListNotificationsResponse, error) {
	var (
		accountID = req.GetAuthContext().GetAccountId()
		deviceID  = req.GetDeviceId()
	)

	notifications, err := s.DB.NotificationStore().List(ctx, accountID, deviceID)
	if err != nil {
		if err == scylla.ErrNotFound {
			return &notification.ListNotificationsResponse{}, nil
		}

		return nil, status.Error(codes.Internal, err.Error())
	}

	var (
		uniqIds     = map[int32]struct{}{}
		campaignIDs = make([]int32, 0)
	)

	for i := range notifications {
		var id = notifications[i].CampaignId
		if _, ok := uniqIds[id]; ok {
			continue
		}
		uniqIds[id] = struct{}{}
		campaignIDs = append(campaignIDs, id)
	}

	// Note: cql recommends not to use an IN query. This also means caching is easier to implement
	settings, err := s.getNotificationSettingsByIds(ctx, campaignIDs)
	if err != nil {
		if err == scylla.ErrNotFound {
			// TODO  log here NotFound means db is not in a correct state
		}
		return nil, status.Error(codes.Internal, errors.Wrap(err, "getNotificationSettingsByIds").Error())
	}

	// index the settings by campaignID
	var settingsByCampaignID = map[int32]*scylla.NotificationSettings{}
	for i := range settings {
		settingsByCampaignID[settings[i].CampaignId] = settings[i]
	}

	// now loop through notifications building them out into models
	var notes = make([]*notification.ListNotificationsResponse_Notification, len(notifications))
	for i := range notifications {
		notes[i] = notificationToProto(notifications[i], settingsByCampaignID[notifications[i].CampaignId])
	}

	return &notification.ListNotificationsResponse{
		Notifications: notes,
	}, nil
}

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

func (s *NotificationServer) getNotificationSettingsByIds(ctx context.Context, campaignIDs []int32) ([]*scylla.NotificationSettings, error) {

	var settings = make([]*scylla.NotificationSettings, len(campaignIDs))

	for i, id := range campaignIDs {
		setting, err := s.DB.NotificationSettingsStore().OneById(ctx, id)
		if err != nil {
			return nil, err
		} else {
			settings[i] = setting
		}
	}

	return settings, nil
}

func notificationToProto(note *scylla.Notification, settings *scylla.NotificationSettings) *notification.ListNotificationsResponse_Notification {
	return &notification.ListNotificationsResponse_Notification{
		Id:         note.Id.String(),
		CampaignId: note.CampaignId,
		Title:      note.Title,
		Body:       note.Body,
		IsRead:     note.IsRead,
		IsDeleted:  note.IsDeleted,
		CreatedAt:  timeToProto(note.CreatedAt()),

		// Static props
		ExperienceId:               settings.ExperienceId,
		NotificationAttachmentUrl:  settings.AttachmentUrl,
		NotificationAttachmentType: attachmentTypeToProto(settings.AttachmentType),

		NotificationTapBehaviorUrl:              settings.TapBehaviorUrl,
		NotificationTapBehaviorType:             notification.NotificationTapBehaviorType_Enum(notification.NotificationTapBehaviorType_Enum_value[string(settings.TapBehaviorType)]),
		NotificationTapBehaviorPresentationType: notification.NotificationTapPresentationType_Enum(notification.NotificationTapPresentationType_Enum_value[string(settings.TapBehaviorPresentationType)]),

		IsNotificationCenterEnabled: settings.AlertOptionNotificationCenter,
	}
}

func attachmentTypeToProto(in scylla.AttachmentType) notification.NotificationAttachmentType_Enum {
	switch in {
	case scylla.AttachmentType_NONE:
		return notification.NotificationAttachmentType_UNKNOWN
	case scylla.AttachmentType_AUDIO:
		return notification.NotificationAttachmentType_AUDIO
	case scylla.AttachmentType_IMAGE:
		return notification.NotificationAttachmentType_IMAGE
	case scylla.AttachmentType_VIDEO:
		return notification.NotificationAttachmentType_VIDEO
	default:
		panic(errors.Errorf("unknown attachment type: %s", string(in)))
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

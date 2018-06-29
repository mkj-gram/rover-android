package scheduled_notifications

import (
	"context"
	"time"

	"github.com/pkg/errors"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audiencepb "github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/apis/go/auth/v1"
	notificationpb "github.com/roverplatform/rover/apis/go/notification/v1"
	"github.com/roverplatform/rover/apis/go/protobuf"
	"github.com/roverplatform/rover/campaigns"
	tasks "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
	"github.com/roverplatform/rover/go/retry"
)

var (
	BatchSize = 1000
)

type Handler interface {
	Handle(context.Context, *tasks.Task) (*JobResult, error)
}

type HandlerFunc func(ctx context.Context, t *tasks.Task) (*JobResult, error)

func (fn HandlerFunc) Handle(ctx context.Context, t *tasks.Task) (*JobResult, error) {
	return fn(ctx, t)
}

type (
	JobHandler struct {
		CampaignsStore     CampaignsStore
		AudienceClient     audiencepb.AudienceClient
		NotificationClient notificationpb.NotificationClient
	}

	JobResult struct {
		AccountId  int
		CampaignId int

		IsTest bool

		Devices  []*audiencepb.Device
		Profiles []*audiencepb.Profile

		ChildTaskId int64

		Notification struct {
			Request       *notificationpb.SendCampaignNotificationRequest
			ErrorMessages []string
		}
	}

	CampaignsStore interface {
		OneById(ctx context.Context, accountId int32, campaignId int32) (*campaigns.Campaign, error)
	}
)

func (w *JobHandler) Handle(ctx context.Context, task *tasks.Task) (*JobResult, error) {
	// 1. Query for a new task on table scheduled_notification_task where status is not failed, completed or cancelled and run_at <= now()
	//  2. Update task state to be IN_PROGRESS
	//  3. Fetch the campaign from task.campaign_id
	//  4. Fetch devices & profiles from audience service
	// If scroll_id is present use the ScrollIterator rpc call
	// if test_device_ids is present fetch the devices and profiles individual for now
	// Else pass in campaign.segment_ids and campaign.segment_condition to audience service. Requires a new rpc call QueryBySegments!
	//  5. If audience service returns a scroll create a new task with the scroll field populated. Copy campaign_id run_at and set status to QUEUED. Use a transaction while creating a new task and updating the forked property to true.
	// if it succeeds update task forked property to true.
	// if it fails update error property with last error update run_at time to be some exponential time using number_of_attempts added to the current timestamp and increment number_of_attempts. Do not continue to step 6. Abort the job
	//  6. Build the notification objects ( personalizing with device/profile/events )
	//  7. Mark task as completed ( do this for safety do not want to send out multiple notifications )
	// if this fails do not continue
	//  8. Make rpc call to NotificationService passing in all the built notification objects
	// if it succeeds you're done
	// if it fails update task state to in-progress, update error property with last error, update run_at time to be some exponential time using number_of_attempts added to the current timestamp and increment number_of_attempts

	// release task PG's lock eventually
	defer task.Done()

	if tasks.TaskState(task.State) == tasks.TaskStateQueued {
		if err := task.SetState(tasks.TaskStateInProgress); err != nil {
			return nil, errors.Wrap(err, "SetState: inprogress")
		}
	}

	var (
		acctId     = task.AccountId
		campaignId = task.CampaignId

		authCtx = &auth.AuthContext{
			AccountId:        int32(acctId),
			PermissionScopes: []string{"server"},
		}

		batch = &JobResult{
			IsTest:     task.IsTest,
			AccountId:  acctId,
			CampaignId: campaignId,
		}

		campaign *campaigns.Campaign
	)

	var (
		isRetryable = func(err error) bool {
			statuscode, ok := status.FromError(err)
			if !ok {
				return false
			}

			switch statuscode.Code() {
			case codes.Canceled, codes.DeadlineExceeded, codes.ResourceExhausted, codes.Internal, codes.Unavailable:
				return true
			default:
				return false
			}
		}

		processBatch = func() error {

			if err := task.SetState(tasks.TaskStateCompleted); err != nil {
				return errors.Wrap(err, "SetState: completed")
			}

			req, err := buildNotificationRequest(batch, campaign)
			if err != nil {
				return errors.Wrap(err, "buildNotificationRequest")
			}

			req.AuthContext = authCtx

			batch.Notification.Request = req

			var (
				backoff = &retry.Backoff{
					MaxAttempts: 10,
					Jitter:      true,
					Factor:      2,
					Min:         time.Duration(1 * time.Second),
					Max:         time.Duration(10 * time.Minute),
				}
				attempt = 0
			)

			for attempt < backoff.MaxAttempts {

				if attempt > 0 {
					select {
					case <-time.After(backoff.ForAttempt(attempt)):
						// Does nothing
					case <-ctx.Done():
						return errors.Wrap(ctx.Err(), "NotificationClient.SendCampaignNotification")
					}
				}

				resp, err := w.NotificationClient.SendCampaignNotification(ctx, req)
				if err != nil {
					if isRetryable(err) {
						attempt = attempt + 1
						continue
					}
					return errors.Wrap(err, "NotificationClient")

				} else {
					for _, r := range resp.GetResults() {
						if r.Error == true {
							batch.Notification.ErrorMessages = append(batch.Notification.ErrorMessages, r.Message)
						}
					}

					return nil
				}
			}

			// Hit here because we exhausted out max retry
			// TODO add error log here to indicate job has exhausted all retries
			return nil
		}

		handleDeviceIds = func() error {
			devices, err := w.getDevices(ctx, authCtx, task.DeviceIds)
			if err != nil {
				return errors.Wrap(err, "getDevices")
			}

			// no devices - no need to continue
			if len(devices) == 0 {
				if err := task.SetState(tasks.TaskStateCompleted); err != nil {
					return errors.Wrap(err, "SetState: completed")
				}
				return nil
			}

			var (
				profileIdentifiers []string
				uniq               = map[string]bool{}
			)
			// collect profileIdentifiers
			for _, d := range devices {
				if _, ok := uniq[d.ProfileIdentifier]; ok {
					continue
				}
				uniq[d.ProfileIdentifier] = true
				profileIdentifiers = append(profileIdentifiers, d.ProfileIdentifier)
			}

			resp, err := w.AudienceClient.ListProfilesByIdentifiers(ctx, &audiencepb.ListProfilesByIdentifiersRequest{
				AuthContext:        authCtx,
				ProfileIdentifiers: profileIdentifiers,
			})
			if err != nil {
				return errors.Wrap(err, "ListProfilesByIdentifiers")
			}

			batch.Devices = devices
			batch.Profiles = resp.Profiles

			if err := processBatch(); err != nil {
				return errors.Wrap(err, "processBatch")
			}

			return nil
		}

		handleNextBatch = func() error {
			var Q = buildQueryRequest(&audiencepb.QueryRequest_ScrollIterator_Next{
				ScrollId: task.ScrollId,
			})

			if task.TimezoneOffset != 0 || campaign.ScheduledUseLocalDeviceTime {
				Q.TimeZoneOffset = &audiencepb.QueryRequest_TimeZoneOffset{
					Seconds: int32(task.TimezoneOffset),
				}
			}

			Q.AuthContext = authCtx
			resp, err := w.AudienceClient.Query(ctx, Q)
			if err != nil {
				if !isRetryable(err) {
					if err := task.SetState(tasks.TaskStateFailed); err != nil {
						panic(errors.Errorf("audience.Query: SetState=failed: %v", err))
					}
				}
				return errors.Wrap(err, "audience.Query")
			}

			var (
				isLastBatch = len(resp.Devices) < BatchSize
				hasScrollID = resp.ScrollId != ""
				childId     int64
			)

			if !task.Forked && !isLastBatch && hasScrollID {
				var err error
				childId, err = task.Fork(resp.ScrollId)
				if err != nil {
					return errors.Wrap(err, "job.Fork")
				}
			}

			batch.Devices = resp.Devices
			batch.Profiles = resp.Profiles
			batch.ChildTaskId = childId

			if err := processBatch(); err != nil {
				return errors.Wrap(err, "processBatch")
			}

			return nil
		}

		handleFirstBatch = func() error {

			var req = buildQueryRequest(&audiencepb.QueryRequest_QuerySegments{
				Condition: audiencepb.PredicateAggregate_Condition_FromString(campaign.SegmentCondition),
				Ids:       campaign.SegmentIds,
			})

			// TODO: should TimezoneOffset be nullable
			if task.TimezoneOffset != 0 || campaign.ScheduledUseLocalDeviceTime {
				req.TimeZoneOffset = &audiencepb.QueryRequest_TimeZoneOffset{
					Seconds: int32(task.TimezoneOffset),
				}
			}

			req.Iterator = &audiencepb.QueryRequest_ScrollIterator_{
				ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
					Operation: &audiencepb.QueryRequest_ScrollIterator_StartScroll_{
						StartScroll: &audiencepb.QueryRequest_ScrollIterator_StartScroll{
							BatchSize: int32(BatchSize),
						},
					},
				},
			}

			req.AuthContext = authCtx
			resp, err := w.AudienceClient.Query(ctx, req)
			if err != nil {
				return errors.Wrap(err, "audience.Query")
			}

			var (
				isLastBatch = len(resp.Devices) < BatchSize
				hasScrollID = resp.ScrollId != ""
				childId     int64
			)

			if !task.Forked && !isLastBatch && hasScrollID {
				var err error
				childId, err = task.Fork(resp.ScrollId)
				if err != nil {
					return errors.Wrap(err, "job.Fork")
				}
			}

			batch.Devices = resp.Devices
			batch.Profiles = resp.Profiles
			batch.ChildTaskId = childId

			if err := processBatch(); err != nil {
				return errors.Wrap(err, "processBatch")
			}

			return nil
		}
	)

	if err := func() error {
		var err error
		campaign, err = w.CampaignsStore.OneById(ctx, int32(acctId), int32(campaignId))
		if err != nil {
			return errors.Wrap(err, "CampaignsStore.OneById")
		}
		if len(task.DeviceIds) > 0 {
			return errors.Wrap(handleDeviceIds(), "DeviceIds")
		} else if task.ScrollId != "" {
			return errors.Wrap(handleNextBatch(), "NextBatch")
		} else {
			return errors.Wrap(handleFirstBatch(), "FirstBatch")
		}
	}(); err != nil {
		if err2 := task.SetError(err.Error()); err2 != nil {
			panic(err2.Error() + "\n\n SetError:" + err.Error())
		}

		return batch, err
	}

	return batch, nil
}

// TODO: add RPC to bulk fetch by the ids
func (w *JobHandler) getDevices(ctx context.Context, authCtx *auth.AuthContext, deviceIds []string) ([]*audiencepb.Device, error) {
	var devices []*audiencepb.Device

	for _, deviceId := range deviceIds {
		resp, err := w.AudienceClient.GetDevice(ctx, &audiencepb.GetDeviceRequest{
			AuthContext: authCtx,
			DeviceId:    deviceId,
		})

		if err != nil {
			if st, ok := status.FromError(errors.Cause(err)); ok && st.Code() == codes.NotFound {
				continue
			}
			return nil, err
		}

		devices = append(devices, resp.Device)
	}

	return devices, nil
}

// hides some protobuf complexity
func buildQueryRequest(input interface{}) *audiencepb.QueryRequest {
	switch val := input.(type) {
	case *audiencepb.QueryRequest_ScrollIterator_Next:
		return &audiencepb.QueryRequest{
			Iterator: &audiencepb.QueryRequest_ScrollIterator_{
				ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
					Operation: &audiencepb.QueryRequest_ScrollIterator_Next_{
						Next: val,
					},
				},
			},
		}

	case *audiencepb.QueryRequest_QuerySegments:
		return &audiencepb.QueryRequest{
			Query: &audiencepb.QueryRequest_QuerySegments_{
				QuerySegments: val,
			},
		}
	}

	panic(errors.Errorf("buildQueryRequest: unexpected input:%T, %v", input, input))
}

func buildNotificationRequest(b *JobResult, c *campaigns.Campaign) (*notificationpb.SendCampaignNotificationRequest, error) {

	var messages = make([]*notificationpb.SendCampaignNotificationRequest_Message, len(b.Devices))
	for i, d := range b.Devices {
		messages[i] = &notificationpb.SendCampaignNotificationRequest_Message{

			// TODO: Render template
			NotificationBody:  c.NotificationBody,
			NotificationTitle: c.NotificationTitle,

			DeviceId:                   d.DeviceId,
			DeviceAppNamespace:         d.AppNamespace,
			DeviceAppBadgeNumber:       d.AppBadgeNumber,
			DevicePushToken:            d.PushTokenKey,
			DevicePushTokenEnvironment: toPushEnvironment(d.PushEnvironment.String()),

			OsName:     d.OsName,
			SdkVersion: getSdkVersion(d.GetFrameworks()),

			IsTest: b.IsTest,
		}
	}

	var req = &notificationpb.SendCampaignNotificationRequest{
		CampaignId:   c.CampaignId,
		ExperienceId: c.ExperienceId,

		Messages: messages,

		NotificationAttachmentUrl:               c.NotificationAttachmentUrl,
		NotificationAttachmentType:              toNotificationAttachementType(c.NotificationAttachmentType),
		NotificationTapBehaviorType:             toNotificationTapBehaviorType(c.NotificationTapBehaviorType),
		NotificationTapBehaviorPresentationType: toNotificationTapBehaviorPresentationType(c.NotificationTapBehaviorPresentationType),
		NotificationTapBehaviorUrl:              c.NotificationTapBehaviorUrl,
		NotificationIosContentAvailable:         c.NotificationIosContentAvailable,
		NotificationIosMutableContent:           c.NotificationIosMutableContent,
		NotificationIosSound:                    c.NotificationIosSound,
		NotificationIosCategoryIdentifier:       c.NotificationIosCategoryIdentifier,
		NotificationIosThreadIdentifier:         c.NotificationIosThreadIdentifier,
		NotificationAndroidChannelId:            c.NotificationAndroidChannelId,
		NotificationAndroidSound:                c.NotificationAndroidSound,
		NotificationAndroidTag:                  c.NotificationAndroidTag,
		NotificationExpiration:                  c.NotificationExpiration,
		// TODO: type mismatch
		// NotificationAttributes:                    c.NotificationAttributes,
		NotificationAlertOptionPushNotification:   c.NotificationAlertOptionPushNotification,
		NotificationAlertOptionNotificationCenter: c.NotificationAlertOptionNotificationCenter,
		NotificationAlertOptionBadgeNumber:        c.NotificationAlertOptionBadgeNumber,
	}

	return req, nil
}

func getSdkVersion(frameworks map[string]*audiencepb.Version) *rover_protobuf.Version {
	if version, ok := frameworks["io.rover.Rover"]; ok {
		return &rover_protobuf.Version{
			Major:    version.Major,
			Minor:    version.Minor,
			Revision: version.Revision,
		}
	}

	return nil
}

func toPushEnvironment(str string) notificationpb.PushEnvironment_Enum {
	v, ok := notificationpb.PushEnvironment_Enum_value[str]
	if !ok {
		panic(errors.Wrap(errors.Errorf("unknown: %q", str), "PushEnvironment"))
	}
	return notificationpb.PushEnvironment_Enum(v)
}

func toNotificationAttachementType(str string) notificationpb.NotificationAttachmentType_Enum {
	v, ok := notificationpb.NotificationAttachmentType_Enum_value[str]
	if !ok {
		panic(errors.Wrap(errors.Errorf("unknown: %q", str), "NotificationAttachementType"))
	}
	return notificationpb.NotificationAttachmentType_Enum(v)
}

func toNotificationTapBehaviorType(str string) notificationpb.NotificationTapBehaviorType_Enum {
	v, ok := notificationpb.NotificationTapBehaviorType_Enum_value[str]
	if !ok {
		panic(errors.Wrap(errors.Errorf("unknown: %q", str), "NotificationTapBehaviorType"))
	}
	return notificationpb.NotificationTapBehaviorType_Enum(v)
}

func toNotificationTapBehaviorPresentationType(str string) notificationpb.NotificationTapPresentationType_Enum {
	v, ok := notificationpb.NotificationTapPresentationType_Enum_value[str]
	if !ok {
		panic(errors.Wrap(errors.Errorf("unknown: %q", str), "NotificationTapBehaviorPresentationType"))
	}
	return notificationpb.NotificationTapPresentationType_Enum(v)
}

package push

import (
	"context"
	"time"

	"github.com/appleboy/go-fcm"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/golang/protobuf/proto"
	"github.com/pkg/errors"
	"github.com/sideshow/apns2"

	"github.com/roverplatform/rover/apis/go/notification/v1/events"
	"github.com/roverplatform/rover/apis/go/protobuf/wrappers"
	"github.com/roverplatform/rover/go/logger"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	notification_pubsub "github.com/roverplatform/rover/notification/pubsub"
)

type Producer interface {
	Produce(msg *kafka.Message, delivery chan kafka.Event) error
}

var EventTopic = "notification.events"

var TimeFunc = func() time.Time { return time.Now() }

func WithEventTracking(producer Producer, log logger.Logger, handler HandlerFunc) HandlerFunc {

	return HandlerFunc(func(ctx context.Context, m notification_pubsub.Message) (*Response, error) {
		var (
			campaignID int
			accountID  int
			device     notification_pubsub.Device
			queue      []*events.Event
		)

		switch msg := m.(type) {
		case *notification_pubsub.PushMessage:
			if msg.IsTest == true {
				// abort early we don't track metrics for test notifications
				return handler(ctx, m)
			}
			campaignID = msg.CampaignID
			accountID = msg.Device.AccountID
			device = msg.Device

		default:
			return handler(ctx, m)
		}

		resp, err := handler(ctx, m)
		if resp == nil {
			// Unable to determine the channel
			return resp, err
		}

		if resp.NotificationSettings == nil || resp.Notification == nil {
			return resp, err
		}

		now, parseErr := timestamp.TimestampProto(TimeFunc())
		if parseErr != nil {
			return resp, err
		}

		// This notification was saved to the inbox
		if resp.NotificationSettings.AlertOptionNotificationCenter == true {
			queue = append(queue, &events.Event{
				Type: &events.Event_NotificationAddedToNotificationCenter{
					NotificationAddedToNotificationCenter: &events.NotificationAddedToNotificationCenter{
						Timestamp:  now,
						AccountId:  int32(accountID),
						CampaignId: int32(campaignID),
						DeviceId:   device.ID,
					},
				},
			})
		}

		// We should have sent out a push notification determine the result
		if resp.NotificationSettings.AlertOptionPushNotification == true {
			if result, err := getResultForPush(resp); err == nil {
				var badge *wrappers.Int32Value
				if result == events.PushNotificationSent_DELIVERED {
					badge = getBadgeForPush(resp)
				}
				queue = append(queue, &events.Event{
					Type: &events.Event_PushNotificationSent{
						PushNotificationSent: &events.PushNotificationSent{
							Timestamp:   now,
							AccountId:   int32(accountID),
							CampaignId:  int32(campaignID),
							DeviceId:    device.ID,
							Result:      result,
							BadgeNumber: badge,
						},
					},
				})
			}

			if resp.APNS.Response != nil {
				if apns, ok := resp.APNS.Response.(*apns2.Response); ok && apns.StatusCode == 410 {
					unregisteredAt, err := timestamp.TimestampProto(apns.Timestamp.Time)
					if err == nil {
						// Device was unregistered
						queue = append(queue, &events.Event{
							Type: &events.Event_PushTokenUnregistered{
								PushTokenUnregistered: &events.PushTokenUnregistered{
									UnregisteredAt: unregisteredAt,
									AccountId:      int32(accountID),
									DeviceId:       device.ID,
									PushToken:      device.PushToken,
								},
							},
						})
					}
				}
			}

			if resp.FCM.Response != nil {
				if res, ok := resp.FCM.Response.(*fcm.Response); ok && len(res.Results) == 1 {
					if res.Results[0].Error == fcm.ErrNotRegistered {
						queue = append(queue, &events.Event{
							Type: &events.Event_PushTokenUnregistered{
								PushTokenUnregistered: &events.PushTokenUnregistered{
									UnregisteredAt:   now,
									AccountId:        int32(accountID),
									DeviceId:         device.ID,
									PushToken:        device.PushToken,
									UpdatedPushToken: res.Results[0].RegistrationID,
								},
							},
						})
					}
				}
			}
		}

		if len(queue) == 0 {
			return resp, err
		}

		var callbacks []chan kafka.Event
		for _, event := range queue {
			data, err := proto.Marshal(event)
			if err != nil {
				// Skip
				continue
			}
			callback := make(chan kafka.Event, 1)
			callbacks = append(callbacks, callback)

			msg := &kafka.Message{
				Timestamp: TimeFunc(),
				Value:     data,
				TopicPartition: kafka.TopicPartition{
					Topic: &EventTopic,
				},
			}
			if err := producer.Produce(msg, callback); err != nil {
				log.Error(err)
				close(callback)
			}
		}

		if len(callbacks) == 0 {
			// really bad
			return resp, err
		}

		// wait for all callbacks discard if we failed or not
		for _, callback := range callbacks {
			res, ok := <-callback
			if ok {
				close(callback)
			}

			switch msg := res.(type) {
			case *kafka.Message:
				if msg.TopicPartition.Error != nil {
					log.Error(msg.TopicPartition)
				}
			case kafka.Error:
				log.Error(msg)
			}

		}

		return resp, err
	})
}

func getBadgeForPush(response *Response) *wrappers.Int32Value {
	if response == nil {
		return nil
	}

	if response.APNS.Request == nil {
		return nil
	}

	req, ok := response.APNS.Request.(*apns2.Notification)
	if !ok {
		return nil
	}

	payload, ok := req.Payload.(map[string]interface{})
	if !ok {
		return nil
	}

	alert, ok := payload["aps"]
	if !ok {
		return nil
	}

	apsPayload, ok := alert.(ApsPayload)
	if !ok {
		return nil
	}

	if apsPayload.Badge == nil {
		return nil
	}

	v, ok := apsPayload.Badge.(int32)
	if !ok {
		return nil
	}

	return &wrappers.Int32Value{Value: v}
}

func getResultForPush(response *Response) (events.PushNotificationSent_Result, error) {
	if response == nil {
		// cannot determine
		return events.PushNotificationSent_INVALID, errors.New("empty result from handler")
	}

	if response.APNS.Request != nil {
		if response.APNS.Response != nil {
			if res, ok := response.APNS.Response.(*apns2.Response); ok {
				switch {
				case res.StatusCode == 200:
					// success
					return events.PushNotificationSent_DELIVERED, nil
				case res.StatusCode == 410:
					// unreachable
					return events.PushNotificationSent_UNREACHABLE, nil
				case res.StatusCode >= 400 && res.StatusCode < 500:
					// invalid
					return events.PushNotificationSent_INVALID, nil
				default:
					// retryable
					// we don't want to track anything as we will most likely retry this
					return events.PushNotificationSent_INVALID, errors.New("apns internal server error")
				}
			} else {
				// something terrible happened the response we got back isn't apns2
				return events.PushNotificationSent_INVALID, nil
			}
		} else {
			// this means we failed with some error before we sent the request
			return events.PushNotificationSent_INVALID, nil
		}
	}

	if response.FCM.Request != nil {
		if response.FCM.Response != nil {
			if res, ok := response.FCM.Response.(*fcm.Response); ok {
				if res.Failure == 1 && len(res.Results) == 1 {
					switch {
					case res.Results[0].Error == fcm.ErrNotRegistered:
						// unreachable
						return events.PushNotificationSent_UNREACHABLE, nil
					default:
						// invalid
						return events.PushNotificationSent_INVALID, nil
					}
				}
				return events.PushNotificationSent_DELIVERED, nil
			} else {
				// The response we got wasn't an fcm response
				return events.PushNotificationSent_INVALID, nil
			}
		} else {
			// this means we failed with some error before we sent the request
			return events.PushNotificationSent_INVALID, nil
		}
	}

	// no push was attempted
	return events.PushNotificationSent_INVALID, errors.New("no push request")
}

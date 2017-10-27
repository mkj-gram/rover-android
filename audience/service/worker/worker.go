package worker

import (
	"encoding/json"
	"strings"

	"golang.org/x/net/context"
	mgo "gopkg.in/mgo.v2"

	"github.com/pkg/errors"

	"cloud.google.com/go/pubsub"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/go/log"
)

var (
	// Client Errors
	InvalidArgument = errors.New("invalid argument")
)

type (
	Logger interface {
		Printf(string, ...interface{})
	}

	BulkHandler interface {
		Handle(context.Context, []*elastic.BulkOp) (*elastic.BulkResponse, error)
		HandleMapping(context.Context, []*elastic.IndexMapping) error
	}

	Worker struct {
		Log          log.Interface
		DB           *mgo.Database
		Bulk         BulkHandler
		AccountIndex func(string) string
	}
)

func (h *Worker) db() (*mgo.Database, *mgo.Session) {
	sess := h.DB.Session.Copy()
	return h.DB.With(sess), sess
}

func (h *Worker) Handle(ctx context.Context, msg *pubsub.Message) error {
	var msgs []service.Message
	err := json.Unmarshal(msg.Data, &msgs)
	if err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	if len(msgs) == 0 {
		return errors.Wrapf(InvalidArgument, "empty batch")
	}

	var (
		bulkOps         []*elastic.BulkOp
		updatedMappings []*elastic.IndexMapping
		merr            multiError
	)

	addErr := func(err error) {
		if err == nil {
			return
		}
		merr = append(merr, err)
	}

	for model, msgs := range groupBy(msgs, "model") {
		switch model {
		case "profileSchema":
			for event, msgs := range groupBy(msgs, "event") {
				switch event {
				case "updated":
					if mappings, err := h.buildProfileMappings(ctx, msgs); err != nil {
						addErr(errors.Wrap(err, "handleProfileSchemasUpdated"))
					} else {
						updatedMappings = append(updatedMappings, mappings...)
					}
				default:
					addErr(errors.Errorf("unknown msg: %s/%s", model, event))
				}
			}
		case "deviceSchema":
			for event, msgs := range groupBy(msgs, "event") {
				switch event {
				case "updated":
					if mappings, err := h.buildDeviceMappings(ctx, msgs); err != nil {
						addErr(errors.Wrap(err, "handleDeviceSchemasUpdated"))
					} else {
						updatedMappings = append(updatedMappings, mappings...)
					}
				default:
					addErr(errors.Errorf("unknown msg: %s/%s", model, event))
				}
			}
		case "deviceSchema":
			for event, _ := range groupBy(msgs, "event") {
				switch event {
				case "updated":
					// ms-12: device schema is not part of ES indexes yet
					h.Log.Errorf("skipping event: %s/%s", model, event)

				default:
					addErr(errors.Errorf("unknown msg: %s/%s", model, event))
				}
			}

		case "device":
			for event, msgs := range groupBy(msgs, "event") {
				switch event {
				case "SetDeviceProfileIdentifier":
					// ms-12: profile_identifier is not used as parent_id yet
					h.Log.Errorf("skipping event: %s/%s", model, event)

				case "updated", "created":
					ops, err := h.handleDevicesUpdated(ctx, msgs)
					if err != nil {
						addErr(errors.Wrap(err, "HandleDevicesUpdated"))
					}
					bulkOps = append(bulkOps, ops...)
				case "deleted":
					ops, err := h.handleDevicesDeleted(ctx, msgs)
					if err != nil {
						addErr(errors.Wrap(err, "HandleDevicesDeleted"))
					}
					bulkOps = append(bulkOps, ops...)

				case "SetDeviceProfile":
					ops, err := h.handleDevicesSetDeviceProfile(ctx, msgs)
					if err != nil {
						addErr(errors.Wrap(err, "HandleDevicesSetDeviceProfile"))
					}
					bulkOps = append(bulkOps, ops...)
				default:
					addErr(errors.Errorf("unknown msg: %s/%s", model, event))
				}
			}
		case "profile":
			for event, msgs := range groupBy(msgs, "event") {
				switch event {
				case "updated", "created":
					ops, err := h.handleProfileUpdated(ctx, msgs)
					if err != nil {
						addErr(errors.Wrap(err, "HandleProfileUpdated"))
					}
					bulkOps = append(bulkOps, ops...)
				case "deleted":
					ops, err := h.handleProfilesDeleted(ctx, msgs)
					if err != nil {
						addErr(errors.Wrap(err, "HandleProfileDeleted"))
					}
					bulkOps = append(bulkOps, ops...)
				default:
					addErr(errors.Errorf("unknown msg: %s/%s", model, event))
				}
			}
		default:
			addErr(errors.Errorf("unknown model: %q", model))
		}
	}

	if updatedMappings != nil {
		if err := h.Bulk.HandleMapping(ctx, updatedMappings); err != nil {
			addErr(errors.Wrap(err, "bulk.HandleMapping"))
		}
	}

	if len(bulkOps) > 0 {
		if resp, err := h.Bulk.Handle(ctx, bulkOps); err != nil {
			addErr(errors.Wrap(err, "bulk.Handle"))
		} else {
			for i, item := range resp.Failed() {
				switch item.Status {
				case 404:
					continue
				default:
				}
				var details interface{}
				if item.Error != nil {
					details = *item.Error
				}
				h.Log.Errorf("bulk: failed=%+v error=%+v details=%+v elasticop=%+v", item.Index, item, details, bulkOps[i])
			}
		}
	}

	if merr != nil {
		return merr
	}

	return nil
}

func groupBy(msgs []service.Message, attr string) map[string][]service.Message {
	var (
		workGroups = make(map[string][]service.Message)
	)

	for _, msg := range msgs {
		key := msg[attr]
		workGroups[key] = append(workGroups[key], msg)
	}

	return workGroups
}

type multiError []error

func (me multiError) Error() string {
	var es []string
	for i := range me {
		if me[i] == nil {
			continue
		}
		es = append(es, me[i].Error())
	}

	return strings.Join(es, "\n")
}

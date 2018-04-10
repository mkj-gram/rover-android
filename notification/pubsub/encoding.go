package pubsub

import (
	"encoding/json"

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
)

const (
	KindSelector = "notification_kind"

	MessageKind = "message"
	SilentKind  = "silent"
)

func Unmarshal(msg *pubsub.Message) (Message, error) {
	var m Message

	switch kind := msg.Attributes[KindSelector]; kind {
	case MessageKind:
		m = &PushMessage{}
	case SilentKind:
		m = &SilentPush{}
	default:
		return nil, errors.Errorf("unknown kind: %q", kind)
	}

	if err := json.Unmarshal(msg.Data, m); err != nil {
		return nil, errors.Wrap(err, "json.Unmarshal")
	}

	return m, nil
}

func Marshal(nmsg Message, m *pubsub.Message) error {
	var attrs = make(map[string]string)
	switch typ := nmsg.(type) {
	case *PushMessage:
		attrs[KindSelector] = MessageKind
	case *SilentPush:
		attrs[KindSelector] = SilentKind
	default:
		return errors.Errorf("type unknown: %T", typ)
	}

	if data, err := json.Marshal(nmsg); err != nil {
		return errors.Wrap(err, "json.Marshal")
	} else {
		m.Data = data
		m.Attributes = attrs
	}

	return nil
}

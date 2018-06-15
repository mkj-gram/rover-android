package scylla

import (
	"context"
	"time"

	"github.com/gocql/gocql"
	"github.com/pkg/errors"
	"github.com/scylladb/gocqlx"
	"github.com/scylladb/gocqlx/qb"

	va "github.com/roverplatform/rover/go/validations"
)

const notificationsTableName = "notifications"

type UUID = gocql.UUID

type Notification struct {
	Id UUID `db:"id"`

	AccountId  int32 `db:"account_id"`
	CampaignId int32 `db:"campaign_id"`

	DeviceId string `db:"device_id"`

	Title string `db:"title"`
	Body  string `db:"body"`

	IsRead    bool `db:"is_read"`
	IsDeleted bool `db:"is_deleted"`
	IsTest    bool `db:"is_test"`
}

func (n *Notification) CreatedAt() time.Time {
	return n.Id.Time()
}

type notificationsStore store

func (c *notificationsStore) OneById(ctx context.Context, acctId int32, deviceId, notificationId string) (*Notification, error) {

	stmt, names := qb.
		Select(notificationsTableName).
		Where(
			qb.Eq("id"),
			qb.Eq("account_id"),
			qb.Eq("device_id"),
		).
		Limit(1).
		ToCql()

	q := gocqlx.
		Query(c.session.Query(stmt).WithContext(ctx), names).
		BindMap(qb.M{
			"account_id": acctId,
			"device_id":  deviceId,
			"id":         notificationId,
		})
	defer q.Release()

	var note Notification
	if err := gocqlx.Get(&note, q.Query); err != nil {
		if err == gocql.ErrNotFound {
			return nil, ErrNotFound
		}
		return nil, errors.Wrap(err, "db.Get")
	}

	return &note, nil
}

func (c *notificationsStore) List(ctx context.Context, accountID int32, deviceID string) ([]*Notification, error) {

	stmt, names := qb.
		Select(notificationsTableName).
		Where(
			qb.Eq("account_id"),
			qb.Eq("device_id"),
		).
		OrderBy("id", qb.DESC).
		Limit(100). // TODO make this configurable
		ToCql()

	q := gocqlx.Query(c.session.Query(stmt).WithContext(ctx), names).BindMap(qb.M{
		"account_id": accountID,
		"device_id":  deviceID,
	})
	defer q.Release()

	var notes []*Notification
	if err := gocqlx.Select(&notes, q.Query); err != nil {
		// err is no rows found do we bubble up or just return empty?
		if err == gocql.ErrNotFound {
			return nil, ErrNotFound
		}
		return nil, errors.Wrap(err, "db.Select")
	}

	return notes, nil
}

func (c *notificationsStore) Create(ctx context.Context, note *Notification) error {
	if err := va.All(
		va.Value("id", note.Id, validateUUID),
		va.Value("account_id", note.AccountId, va.Require),
		va.Value("campaign_id", note.CampaignId, va.Require),
		va.Value("device_id", note.DeviceId, va.Require),
		va.Value("body", note.Body, va.Require),
	); err != nil {
		return errors.Wrap(err, "validations")
	}

	fieldNames := []string{
		"id",
		"account_id",
		"campaign_id",
		"device_id",
		"title",
		"body",
		"is_read",
		"is_deleted",
		"is_test",
	}

	stmt, names := qb.
		Insert(notificationsTableName).
		Columns(fieldNames...).
		ToCql()

	if err := gocqlx.
		Query(c.session.Query(stmt), names).
		BindStruct(note).
		ExecRelease(); err != nil {
		return errors.Wrap(err, "db.Create")
	}

	return nil
}

func (c *notificationsStore) SetReadStatus(ctx context.Context, accountID int32, deviceID string, notificationID string, isRead bool) error {
	// TODO until we have LWT we need to manually check if it exists first
	if _, err := c.OneById(ctx, accountID, deviceID, notificationID); err != nil {
		return errors.Wrap(err, "OneById")
	}

	stmt, names := qb.
		Update(notificationsTableName).
		Where(
			qb.Eq("id"),
			qb.Eq("account_id"),
			qb.Eq("device_id"),
		).
		Set("is_read").
		// Existing(). TODO wait for LWT
		ToCql()

	q := gocqlx.
		Query(c.session.Query(stmt).WithContext(ctx), names).
		BindMap(qb.M{
			"id":         notificationID,
			"account_id": accountID,
			"device_id":  deviceID,

			"is_read": isRead,
		})

	if err := q.ExecRelease(); err != nil {
		return errors.Wrap(err, "db.Set")
	}

	return nil
}

func (c *notificationsStore) Delete(ctx context.Context, accountID int32, deviceID string, notificationID string) error {

	// Check that the notification exists
	if _, err := c.OneById(ctx, accountID, deviceID, notificationID); err != nil {
		return errors.Wrap(err, "OneById")
	}

	stmt, names := qb.
		Delete(notificationsTableName).
		Where(
			qb.Eq("id"),
			qb.Eq("account_id"),
			qb.Eq("device_id"),
		).
		// Existing(). TODO wait for LWT
		ToCql()

	q := gocqlx.
		Query(c.session.Query(stmt).WithContext(ctx), names).
		BindMap(qb.M{
			"id":         notificationID,
			"account_id": accountID,
			"device_id":  deviceID,
		})

	if err := q.ExecRelease(); err != nil {
		return errors.Wrap(err, "db.Delete")
	}

	return nil
}

func validateUUID(val interface{}) error {
	uuid, ok := val.(UUID)
	if !ok {
		return errors.Wrap(ErrInvalid, "type")
	}

	for i := range uuid[:] {
		if uuid[i] > 0 {
			return nil
		}
	}

	return errors.Wrap(ErrInvalid, "uuid")
}

package db

import (
	"context"
	"database/sql"
)

func (db *campaignsStore) UpdateStatus(ctx context.Context, accountId, campaignId int32, status string) error {
	return CampaignUpdateStatus(db.db, ctx, accountId, campaignId, status)
}

func (tx *campaignsStoreTx) UpdateStatus(ctx context.Context, accountId, campaignId int32, status string) error {
	return CampaignUpdateStatus(tx.tx, ctx, accountId, campaignId, status)
}

type namedExecer interface {
	NamedExecContext(ctx context.Context, query string, arg interface{}) (sql.Result, error)
}

func CampaignUpdateStatus(dbCtx namedExecer, ctx context.Context, accountId, campaignId int32, status string) error {
	var (
		now = TimeNow()

		args = map[string]interface{}{
			"campaign_status": status,
			"account_id":      accountId,
			"campaign_id":     campaignId,
			"updated_at":      now,
		}

		q = `
			UPDATE campaigns
				SET
					campaign_status = :campaign_status
					,updated_at			= :updated_at
				WHERE
					account_id = :account_id
					AND			id = :campaign_id
					AND	campaign_status != :campaign_status
			`
	)

	res, err := dbCtx.NamedExecContext(ctx, q, args)
	if err != nil {
		return wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return wrapError(err, "res.RowsAffected")
	}

	if n == 0 {
		return wrapError(sql.ErrNoRows, "db.Update")
	}

	return nil
}

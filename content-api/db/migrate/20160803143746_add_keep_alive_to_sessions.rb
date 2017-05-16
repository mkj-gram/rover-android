class AddKeepAliveToSessions < ActiveRecord::Migration
    def change
        add_column :sessions, :last_seen_at, :datetime
        add_column :sessions, :expires_at, :datetime

        Session.update_all(last_seen_at: Time.zone.now, expires_at: Time.zone.now)
    end
end

class AddScheduleDatetimeToMessages < ActiveRecord::Migration
    def change

        add_column :messages, :scheduled_at, :timestamp
        add_column :messages, :scheduled_local_time, :boolean, default: false
        add_column :messages, :scheduled_token, :string

        # Partial index for sorting scheduled messages
        # add_index :messages, [:type, :published, :scheduled_at], where: "published = true AND type = 'ScheduledMessage' AND sent = false", name: "index_scheduled_messages_on_published_scheduled_at"

    end
end

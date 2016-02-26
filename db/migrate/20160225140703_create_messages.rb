class CreateMessages < ActiveRecord::Migration
    def change
        create_table :messages do |t|
            t.integer :account_id, null: false
            t.string :type, null: false

            t.string :title
            t.text :notification_text
            t.boolean :published, default: false
            t.boolean :archived, default: false

            t.date :start_date
            t.date :end_date

            t.integer :approximate_customers_count

            t.integer :trigger_event_id
            t.integer :dwell_time_in_seconds

            # filters
            t.string    :filter_beacon_configuration_tags, array: true
            t.integer   :filter_beacon_configuration_ids, array: true
            t.string    :filter_location_tags, array: true
            t.integer   :filter_location_ids, array: true

            t.timestamps null: false
        end

        # Create a partial index to quickly search up published proximity messages with specific trigger_event_id
        add_index :messages, [:account_id, :type, :published, :trigger_event_id], where: "published = true AND type = 'ProximityMessage'", name: "index_messages_on_account_id_type_published_trigger_event_id"
    end
end

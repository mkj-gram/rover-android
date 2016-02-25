class CreateMessages < ActiveRecord::Migration
    def change
        create_table :messages do |t|
            t.integer :account_id, null: false
            t.string :type, null: false

            t.string :title
            t.text :notification_text
            t.boolean :published, default: false
            t.boolean :archived, default: false

            t.daterange :schedule
            t.integer :approximate_customers_count

            t.integer :trigger_event_id
            t.integer :dwell_time_in_seconds

            # filters
            t.string    :filter_beacon_configuration_tags, array: true
            t.integer   :filter_beacon_configuration_ids, array: true
            t.string    :filter_location_configuration_tags, array: true
            t.integer   :filter_location_configuration_ids, array: true

            t.timestamps null: false
        end

        # only want to search messages by trigger_event_id where type is ProximityMessage
        add_index :messages, [:account_id, :type, :trigger_event_id], where: "type = 'ProximityMessage'"
        # add a partial index since we are only searching for
        # messages which have not been archived
        # archived messages will be searched within elasticsearch
        # add_index :messages, [:account_id, :type, :archived], where: "archived = false"
    end
end

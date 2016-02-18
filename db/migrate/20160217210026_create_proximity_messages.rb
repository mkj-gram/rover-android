class CreateProximityMessages < ActiveRecord::Migration
    def change
        # enable_extension "btree_gist"
        create_table :proximity_messages do |t|
            t.integer :account_id, null: false
            t.string :title
            t.text :message

            t.daterange :schedule
            t.integer :approximate_customers_count

            t.integer :trigger_event_id, null: false
            # t.integer :dwell_time_in_seconds

            # filters
            t.string    :filter_beacon_configuration_tags, array: true
            t.integer   :filter_beacon_configuration_ids, array: true
            t.string    :filter_location_configuration_tags, array: true
            t.integer   :filter_location_configuration_ids, array: true

            t.timestamps null: false
        end

        add_index :proximity_messages, [:account_id, :trigger_event_id]


        # add_index :proximity_messages, [:account_id, :schedule], using: :gist
    end
end

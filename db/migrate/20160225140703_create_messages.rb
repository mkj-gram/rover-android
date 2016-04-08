class CreateMessages < ActiveRecord::Migration
    def change
        enable_extension "hstore"
        create_table :messages do |t|
            t.integer :account_id, null: false
            t.string :type, null: false

            t.string :title
            t.string :tags, array: true, default: []
            t.text :notification_text
            t.boolean :published, default: false
            t.boolean :archived, default: false
            t.boolean :save_to_inbox, default: true
            t.string :tags, array: true
            # schedule holds the days and times of when to push
            # bug with rails 4
            # t.tsrange :schedule, default: Float::INFINITY..Float::INFINITY
            t.int4range :date_schedule, default: Float::INFINITY..Float::INFINITY
            # defaults to the whole day ie between 0 minutes and 1440 mins end of day
            t.int4range :time_schedule, default: 0..1440

            t.boolean :schedule_monday, default: true
            t.boolean :schedule_tuesday, default: true
            t.boolean :schedule_wednesday, default: true
            t.boolean :schedule_thursday, default: true
            t.boolean :schedule_friday, default: true
            t.boolean :schedule_saturday, default: true
            t.boolean :schedule_sunday, default: true



            t.integer :trigger_event_id
            t.integer :dwell_time_in_seconds
            # segment
            t.integer :customer_segment_id
            # limits
            t.hstore :limits, array: true

            # filters
            t.string    :filter_beacon_configuration_tags, array: true
            t.integer   :filter_beacon_configuration_ids, array: true
            t.string    :filter_location_tags, array: true
            t.integer   :filter_location_ids, array: true
            t.string    :filter_gimbal_place_id


            # Actions
            #
            t.string :action # "open-url"
            t.string :action_url # "https://google.ca"
            t.integer :action_landing_page_id
            t.integer :action_experience_id

            t.timestamps null: false
        end

        # Create a partial index to quickly search up published proximity messages with specific trigger_event_id
        add_index :messages, [:account_id, :type, :published, :trigger_event_id], where: "published = true AND type = 'ProximityMessage'", name: "index_messages_on_account_id_type_published_trigger_event_id"
    end
end

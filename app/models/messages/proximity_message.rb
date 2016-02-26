class ProximityMessage < Message
    include MessagesElasticsearchChild

    belongs_to :account, counter_cache: :proximity_messages_count
    before_save :update_archived_messages_count


    mappings do
        indexes :trigger_event_id, type: 'integer', index: 'no'
        indexes :dwell_time_in_seconds, type: 'integer', index: 'no'
        indexes :filter_beacon_configuration_tags, type: 'string', index: 'no'
        indexes :filter_beacon_configuration_ids, type: 'string', index: 'no'
        indexes :filter_location_tags, type: 'string', index: 'no'
        indexes :filter_location_ids, type: 'string', index: 'no'
    end

    def filter_beacon_configurations
        @filter_beacon_configurations ||= filter_beacon_configuration_ids.any? ? BeaconConfiguration.where(id: filter_beacon_configuration_ids) : []
    end

    def filter_locations
        @filter_locations ||= filter_location_ids.any? ? Location.where(id: filter_location_ids).all : []
    end

    private

    def update_archived_messages_count
        if archived == true && archived_was == false
            Account.update_counters(self.account_id, archived_proximity_messages_count: 1)
        elsif archived == false && archived_was == true
            Account.update_counters(self.account_id, archived_proximity_messages_count: -1)
        end

    end
end

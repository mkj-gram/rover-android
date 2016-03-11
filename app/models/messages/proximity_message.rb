class ProximityMessage < Message
    include MessagesElasticsearchChild
    include DefaultEmptyArray

    belongs_to :account, counter_cache: :proximity_messages_count
    before_save :update_archived_messages_count

    after_save :update_approximate_customers_count



    default_empty_array_attribute :filter_beacon_configuration_tags
    default_empty_array_attribute :filter_beacon_configuration_ids
    default_empty_array_attribute :filter_location_tags
    default_empty_array_attribute :filter_location_ids

    validate :legal_trigger_event_id


    def to_inbox_message(opts)
        @inbox_message ||= -> {
            inbox_message = InboxMessage.new(
                {
                    title: self.title,
                    message_id: self.id,
                    notification_text: formatted_message(opts),
                    read: true,
                    saved_to_inbox: self.save_to_inbox,
                    timestamp: Time.now
                }
            )
            inbox_message.message = self
            return inbox_message
        }.call
    end

    def filter_beacon_configurations
        @filter_beacon_configurations ||= filter_beacon_configuration_ids.any? ? BeaconConfiguration.where(id: filter_beacon_configuration_ids) : []
    end

    def filter_locations
        @filter_locations ||= filter_location_ids.any? ? Location.where(id: filter_location_ids).all : []
    end

    private

    def legal_trigger_event_id
        if published && !Event.valid_event_id(self.trigger_event_id)
            errors.add(:trigger_event_id, "invalid")
        end
        # if published then the trigger_event_id must also be valid
        # if published && !Event.valid_event_id(trigger_event_id)
        #     errors.add(:trigger_event_id, "invalid")
        # end
    end

    def update_approximate_customers_count
        # we need to update here
        # if we changed the filters we need to update
        #
    end

    def update_archived_messages_count
        if archived == true && archived_was == false
            Account.update_counters(self.account_id, archived_proximity_messages_count: 1)
        elsif archived == false && archived_was == true
            Account.update_counters(self.account_id, archived_proximity_messages_count: -1)
        end

    end
end

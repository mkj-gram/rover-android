class ProximityMessageTemplate < MessageTemplate
    include MessageTemplateElasticsearchDocument
    include DefaultEmptyArray

    belongs_to :account

    before_save :update_archived_messages_count

    after_save :update_approximate_customers_count



    default_empty_array_attribute :filter_beacon_configuration_tags
    default_empty_array_attribute :filter_beacon_configuration_ids
    default_empty_array_attribute :filter_location_tags
    default_empty_array_attribute :filter_location_ids

    validate :legal_trigger_event_id


    def filter_beacon_configurations
        @filter_beacon_configurations ||= filter_beacon_configuration_ids.any? ? BeaconConfiguration.where(id: filter_beacon_configuration_ids) : []
    end

    def filter_locations
        @filter_locations ||= filter_location_ids.any? ? Location.where(id: filter_location_ids).all : []
    end

    def drafted
        published == false && archived == false
    end

    def drafted_was
        published_was == false && archived_was == false
    end

    def metric_type
        "message_template.proximity"
    end

    private

    def legal_trigger_event_id
        if published && !Events::Pipeline.targetable_event?(self.trigger_event_id)
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
        if self.changes.include?(:archived) || self.changes.include?(:published) && !new_record?

            if archived == true && archived_was == false
                Account.update_counters(self.account_id, proximity_message_templates_archived_count: 1)
            end

            if archived == false && archived_was == true
                Account.update_counters(self.account_id, proximity_message_templates_archived_count: -1)
            end

            if published == true && published_was == false
                Account.update_counters(self.account_id, proximity_message_templates_published_count: 1)
            end

            if published_was == true && published == false
                Account.update_counters(self.account_id, proximity_message_templates_published_count: -1)
            end

            if drafted == true && drafted_was == false
                Account.update_counters(self.account_id, proximity_message_templates_draft_count: 1)
            end

            if drafted_was == true && drafted == false
                Account.update_counters(self.account_id, proximity_message_templates_draft_count: -1)
            end
        elsif self.new_record?
            if archived
                Account.update_counters(self.account_id, proximity_message_templates_archived_count: 1)
            elsif published
                Account.update_counters(self.account_id, proximity_message_templates_published_count: 1)
            else
                Account.update_counters(self.account_id, proximity_message_templates_draft_count: 1)
            end
        end


    end
end

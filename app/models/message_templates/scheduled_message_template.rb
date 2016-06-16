class ScheduledMessageTemplate < MessageTemplate
    include MessageTemplateElasticsearchDocument

    TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

    validate :can_publish_message, if: -> { self.published == true }
    # validate :can_modify_message

    before_save :update_scheduled_token
    before_save :update_account_counters
    before_save :publish_message_to_queue



    mapping do
        indexes :sent, type: 'boolean', index: 'not_analyzed'
    end

    def scheduled_at=(time)
        # this needs to be stored in utc
        parsed_time = if time.nil?
            Time.zone.now
        elsif time.is_a?(Integer)
            Time.zone.at(time)
        elsif time.is_a?(Float)
            Time.zone.at(time)
        elsif time.is_a?(Time)
            time.utc
        elsif time.is_a?(DateTime)
            time.utc
        else
            Time.zone.parse(time)
        end
        super parsed_time
    end

    def metric_type
        "message_template.scheduled"
    end

    def sent=(new_value)
        if new_value == true
            published = true
            archived = false
        end
        super new_value
    end

    def published=(new_value)
        if new_value  == true
            archived = false
        end
        super new_value
    end

    def as_indexed_json(opts = {})
        json = super opts
        json = (json || {}).merge(sent: sent)
        json
    end

    private

    def can_publish_message
        if scheduled_local_time == true && (scheduled_at - Time.zone.now) < 24.hours
            errors.add(:scheduled_at, "needs a 24 hour window")
        end

        if scheduled_at < Time.zone.now
            errors.add(:scheduled_at, "cannot schedule a message in the past")
        end
    end

    def publish_message_to_queue
        if changes.any? && published
            Rails.logger.info("Scheduling Message #{self.id} #{self.title}")
            ScheduledMessageJobMasterWorker.perform_async(self)
        end
    end

    def update_scheduled_token
        if published_changed?
            self.scheduled_token = SecureRandom.hex
        end
    end

    def get_counter_column_from_status(status)
        case status
        when :draft
            :scheduled_message_templates_draft_count
        when :published
            :scheduled_message_templates_published_count
        when :sent
            :scheduled_message_templates_sent_count
        else
            :scheduled_message_templates_archived_count
        end
    end

    # def can_modify_message
    #     if sent_was == true && sent == true &&
    #         changes.each do |k,v|
    #             errors.add(k, "unable to modify, message has already been sent")
    #         end
    #     end
    # end

    def update_account_counters
        if previous_status != current_status
            # status has changed
            if previous_status != :nil
                Account.update_counters(self.account_id, get_counter_column_from_status(previous_status) => -1, get_counter_column_from_status(current_status) => 1)
            else
                Account.update_counters(self.account_id, get_counter_column_from_status(current_status) => 1)
            end
        end
    end

    def previous_status
        if new_record? || (published_was == nil && archived_was == nil && sent_was == nil)
            :nil
        elsif published_was == false && archived_was == false && sent_was == false
            :draft
        elsif published_was == false && sent_was == false && archived_was == true
            :archived
        elsif published_was == false && archived_was == false && sent_was == true
            :sent
        else
            :published
        end
    end

    def current_status
        if published == false && archived == false && sent == false
            :draft
        elsif published == false && sent == false && archived == true
            :archived
        elsif published == false && archived == false && sent == true
            :sent
        else
            :published
        end
    end


end

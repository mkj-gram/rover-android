class ScheduledMessageTemplate < MessageTemplate
    include MessageTemplateElasticsearchDocument

    TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

    validate :can_publish_message, if: -> { self.published == true }

    before_save :publish_message

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
        self.scheduled_token = SecureRandom.hex if parsed_time != scheduled_at
        self["scheduled_at"] = parsed_time
    end

    def metric_type
        "message_template.scheduled"
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

    def publish_message
        if self.changes.include?(:scheduled_token)
            Rails.logger.info("Scheduling Message #{self.id} #{self.title}")
            # self.update_attribute(:scheduled_token, SecureRandom.hex)
            ScheduledMessageJob.perform_async(self)
        end
    end

end

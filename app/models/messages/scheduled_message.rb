class ScheduledMessage < Message
    include MessagesElasticsearchChild

    TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

    validate :can_publish_message

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
        self["scheduled_at"] = parsed_time
    end



    private

    def can_publish_message
        true
    end

    def publish_message
        if self.changes.include?(:published) && published_was == false && published == true
            Rails.logger.info("Scheduling Message #{self.id} #{self.title}")
            self.scheduled_token = SecureRandom.hex
            ScheduledMessageJob.perform_async(self)
        end
    end

end

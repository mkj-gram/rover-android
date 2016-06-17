class ScheduledMessageTemplate < MessageTemplate
    include MessageTemplateElasticsearchDocument

    TIME_REGEX = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/

    validate :can_publish_message, if: -> { self.published == true }
    validates :scheduled_time_zone, presence: true
    # validate :can_modify_message

    before_save :update_scheduled_token
    # before_save :set_scheduled_at_time
    before_save :set_sent_status
    before_save :update_account_counters
    after_commit :publish_message_to_queue, on: [:create, :update]

    after_commit on: [:create, :update] do
        __elasticsearch__.index_document
    end

    after_commit on: [:destroy] do
        __elasticsearch__.delete_document
    end

    mapping do
        indexes :sent, type: 'boolean', index: 'not_analyzed'
    end

    # def scheduled_at=(time)
    #     parsed_time = Time.parse(time)
    #     self.scheduled_at_time_zone = parsed_time.zone
    #     super parsed_time.in_time_zone("UTC")
    # end

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

    def scheduled_timestamp
        scheduled_at ? scheduled_at.in_time_zone(scheduled_time_zone).strftime("%Y-%m-%dT%H:%M:%S") : nil
    end

    def scheduled_timestamp=(new_timestamp)
        if new_timestamp
            if scheduled_time_zone
                Time.use_zone(scheduled_time_zone) do
                    self.scheduled_at = Time.zone.parse(new_timestamp)
                end
            else
                self.scheduled_at = Time.zone.parse(new_timestamp)
            end
        else
            self.scheduled_at = nil
        end
    end

    def use_local_time_zone=(new_value)
        self.scheduled_local_time = new_value
    end

    def use_local_time_zone
        self.scheduled_local_time
    end

    private



    def set_sent_status
        if changes.include?("published") && published == true && scheduled_at.nil? || (!scheduled_at.nil? && scheduled_at.utc < Time.zone.now)
            Time.use_zone(self.scheduled_time_zone) do
                self.scheduled_at = Time.now.utc
            end
            self.sent = true
        end
    end

    def can_publish_message
        if scheduled_local_time == true && (scheduled_at - Time.zone.now) < 24.hours
            errors.add(:scheduled_at, "needs a 24 hour window")
        end
    end

    def publish_message_to_queue
        if previous_changes.any? && previous_changes.include?("published") && published == true
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
        elsif published_was == true && archived_was == false && sent_was == true
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
        elsif published == true && archived == false && sent == true
            :sent
        else
            :published
        end
    end


end

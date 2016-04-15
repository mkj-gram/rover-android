class Message < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include FormattableMessage
    include MessageLimit::Attribute

    message_limit_attribute :limits
    # belongs_to :account
    # doesn't make sense but thats how rails structures relationships
    belongs_to :customer_segment

    belongs_to :account

    message_attribute :notification_text

    settings index: ElasticsearchShardCountHelper.get_settings({ number_of_shards: 1, number_of_replicas: 2}).merge(
        {
            analysis:  {
                filter: {
                    autocomplete_filter: {
                        type: "edge_ngram",
                        min_gram: 1,
                        max_gram: 15
                    }
                },
                analyzer: {
                    autocomplete: {
                        type: "custom",
                        tokenizer: "standard",
                        filter: [
                            "lowercase",
                            "autocomplete_filter"
                        ]
                    },
                    lowercase_keyword: {
                        type: "custom",
                        tokenizer: "keyword",
                        filter: [
                            "lowercase"
                        ]
                    }
                }
            }
        }
    )

    after_initialize :set_proper_time_schedule_range
    after_initialize :set_defaults, unless: :persisted?

    validates :title, presence: true
    validate :valid_date_schedule

    validates :schedule_start_time, inclusion: { in: 0..1440, message: "must be between 0 and 1440" }
    validates :schedule_end_time, inclusion: { in: 0..1440, message: "must be between 0 and 1440" }

    validate :valid_action

    VALID_ACTIONS = Set.new(["link", "landing-page", "experience"])

    def as_indexed_json(opts = {})
        {
            account_id: self.account_id,
            title: self.title,
            notification_text: self.notification_text,
            published: self.published,
            archived: self.archived,
            created_at: self.created_at,
        }
    end
    def to_inbox_message(opts)
        @inbox_message ||= -> {
            inbox_message = InboxMessage.new(
                {
                    title: self.title,
                    message_id: self.id,
                    notification_text: formatted_message(opts),
                    read: false,
                    saved_to_inbox: self.save_to_inbox,
                    action: self.action,
                    action_url: self.action_url,
                    timestamp: Time.now
                }
            )
            inbox_message.message = self
            return inbox_message
        }.call
    end

    def archived=(val)
        if val == true
            self.published = false
        end
        self[:archived] = val
    end

    def schedule_start_date
        @schedule_start_date ||= if schedule_start_parsed_time
            Date.parse(schedule_start_parsed_time.to_s).to_s
        else
            nil
        end
    end

    def schedule_end_date
        @schedule_end_date ||= if schedule_end_parsed_time
            Date.parse(schedule_end_parsed_time.to_s).to_s
        else
            nil
        end
    end

    def schedule_start_time
        return self.time_schedule.first
    end

    def schedule_end_time
        return self.time_schedule.last
    end

    def schedule_start_date=(val)
        val = val.is_a?(DateTime) ?  val.to_date : val
        val = val.is_a?(Date) ? val.to_s : val
        val = val.nil? ? -Float::INFINITY : val
        @schedule_start_date = val
        set_date_schedule! if valid_date(val)
    end

    def schedule_end_date=(val)
        val = val.is_a?(DateTime) ?  val.to_date : val
        val = val.is_a?(Date) ? val.to_s : val
        val = val.nil? ? Float::INFINITY : val
        @schedule_end_date = val
        set_date_schedule! if valid_date(val)
    end

    def schedule_start_time=(val)
        # integer of minutes
        @schedule_start_time = val
        self.time_schedule = Range.new(@schedule_start_time, schedule_end_time)
    end

    def schedule_end_time=(val)
        val = 1440 if val.nil?
        @schedule_end_time = val
        self.time_schedule = Range.new(schedule_start_time, @schedule_end_time)
    end


    def valid_date(date)
        return true if date == Float::INFINITY || date == -Float::INFINITY
        return !!(date =~ /^\d{4}\-\d{2}\-\d{2}$/)
    end

    def schedule_start_parsed_time
        if self.date_schedule && self.date_schedule.first != -Float::INFINITY
            Time.at(self.date_schedule.first)
        else
            nil
        end
    end

    def schedule_end_parsed_time
        if self.date_schedule && self.date_schedule.last != Float::INFINITY
            Time.at(self.date_schedule.last)
        else
            nil
        end
    end

    def set_date_schedule!
        # build the start_date
        if schedule_start_date && schedule_start_date != -Float::INFINITY
            start_date = Time.parse("#{schedule_start_date} 00:00:00").to_i
        else
            start_date = -Float::INFINITY
        end

        if schedule_end_date && schedule_end_date != Float::INFINITY
            end_date = Time.parse("#{schedule_end_date} 00:00:00").to_i
        else
            end_date = Float::INFINITY
        end

        puts "start_date #{start_date} end_date #{end_date}"
        self.date_schedule = Range.new(start_date, end_date)
    end

    def within_schedule(current_time)
        # needs to check the start_time end_time
        # needs to check days of week
        # needs to check time of day
        true
    end

    def apply_configuration_filters(configuration)
        filter_location(configuration) && filter_beacon_configuration(configuration)
    end

    def approximate_customers_count
        return self.customer_segment ? self.customer_segment.customers_count : self.account.customers_count
    end

    def within_customer_segment(customer, device)
        if self.customer_segment_id
            self.customer_segment.within_segment(customer, device)
        else
            true
        end
    end

    def within_message_limits(message_rate_index)
        return true if message_rate_index.nil?
        #  message_rate_index
        #  {"1" => {1: 4, 2: 1, 3: 1}}
        #  within 1 day we have 4 messages within 2 days we have 1 message etc..
        #  describes how many of these messages the user has received
        # loop through all limits
        limits.all? do |limiter|
            message_rate_index[limiter.number_of_minutes] < limiter.message_limit
        end
    end

    def has_message_limits
        limits.any?
    end

    def has_configuration_filters
        (
            filter_beacon_configuration_tags && filter_beacon_configuration_tags.any?  ||
            filter_beacon_configuration_ids && filter_beacon_configuration_ids.any? ||
            filter_location_tags && filter_location_tags.any? ||
            filter_location_ids && filter_location_ids.any?
        )
    end

    def targeted_beacon_configurations_count
        if has_configuration_filters
            return @cached_targeted_beacon_configurations_count if @cached_targeted_beacon_configurations_count
            must_filters = [
                {
                    term: {
                        account_id: self.account_id
                    }
                }
            ]
            should_filters = [
                {
                    term: {
                        account_id: self.account_id
                    }
                },
                {
                    term: {
                        shared_account_ids: self.account_id
                    }
                }
            ]

            if filter_beacon_configuration_ids && filter_beacon_configuration_ids.any?
                must_filters.push(
                    {
                        ids: {
                            values: filter_beacon_configuration_ids
                        }
                    }
                )
            end

            if filter_location_ids && filter_location_ids.any?
                must_filters.push(
                    {
                        terms: {
                            "location.id" => filter_location_ids
                        }
                    }
                )
            end

            if filter_beacon_configuration_tags && filter_beacon_configuration_tags.any?
                filter_beacon_configuration_tags.each do |tag|
                    must_filters.push(
                        {
                            term: {
                                tags: tag
                            }

                        }
                    )
                end
            end

            if filter_location_tags && filter_location_tags.any?
                filter_location_tags.each do |tag|
                    must_filters.push(
                        {
                            term: {
                                "location.tags" => tag
                            }
                        }
                    )
                end
            end



            query = {
                filter: {
                    bool: {
                        must: must_filters,
                        should: should_filters
                    }
                }
            }
            @cached_targeted_beacon_configurations_count = Elasticsearch::Model.client.count(index: BeaconConfiguration.index_name, body: query)["count"]
            return @cached_targeted_beacon_configurations_count
        else
            account.beacon_configurations_count
        end
    end

    private

    def set_defaults
        self.limits ||= [MessageLimit::Limit.new(message_limit: 1, number_of_days: 1)]
        self.time_schedule = Range.new(0,1440)
    end

    def set_proper_time_schedule_range
        self.time_schedule = Range.new(schedule_start_time, schedule_end_time - 1)
    end


    def valid_date_schedule
        if @schedule_start_date && !valid_date(@schedule_start_date)
            errors.add(:schedule_start_date, "invalid format expecting yyyy-mm-dd")
        end

        if @schedule_end_date && !valid_date(@schedule_end_date)
            errors.add(:schedule_end_date, "invalid format expecting yyyy-mm-dd")
        end
    end

    def filter_beacon_configuration(configuration)
        if configuration.is_a?(BeaconConfiguration)
            if filter_beacon_configuration_tags && filter_beacon_configuration_tags.any?
                (filter_beacon_configuration_tags - configuration.tags).empty?
            elsif filter_beacon_configuration_ids && filter_beacon_configuration_ids.any?
                filter_beacon_configuration_ids.include?(configuration.id)
            else
                true
            end
        else
            # if we are only filtering locations
            true
        end
    end

    def filter_location(configuration)
        location = configuration.is_a?(BeaconConfiguration) ? configuration.location : configuration
        if filter_location_tags && filter_location_tags.any?
            !location.nil? && (filter_location_tags - location.tags).empty?
        elsif filter_location_ids && filter_location_ids.any?
            !location.nil? && filter_location_ids.include?(location.id)
        else
            true
        end
    end


    def valid_action
        if published && self.action && !VALID_ACTIONS.include?(self.action)
            errors.add(:action, "invalid, must be of type (#{VALID_ACTIONS.to_a.join(', ')})")
        end
    end
end

class Message < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include FormattableMessage
    include MessageLimit::Attribute
    include CustomerSegment::Attribute

    segment_attribute :customer_segments
    message_limit_attribute :limits
    # belongs_to :account


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
        @schedule_start_time ||= if schedule_start_parsed_time
            schedule_start_parsed_time.strftime("%H:%M:%S")
        else
            nil
        end
    end

    def schedule_end_time
        @schedule_end_time ||= if schedule_end_parsed_time
            schedule_end_parsed_time.strftime("%H:%M:%S")
        else
            nil
        end
    end

    def schedule_start_date=(val)
        val = val.is_a?(DateTime) ?  val.to_date : val
        val = val.is_a?(Date) ? val.to_s : val
        @schedule_start_date = val
        set_schedule! if valid_date(val)
    end

    def schedule_end_date=(val)
        val = val.is_a?(DateTime) ?  val.to_date : val
        val = val.is_a?(Date) ? val.to_s : val
        @schedule_end_date = val
        set_schedule! if valid_date(val)
    end

    def schedule_start_time=(val)
        val = val.is_a?(DateTime) ? val.to_time : val
        val = val.is_a?(Time) ? val.strftime("%H:%M:%S") : val
        @schedule_start_time = val
        set_schedule! if valid_time(val)
    end

    def schedule_end_time=(val)
        val = val.is_a?(DateTime) ? val.to_time : val
        val = val.is_a?(Time) ? val.strftime("%H:%M:%S") : val
        @schedule_end_time = val
        set_schedule! if valid_time(val)
    end


    def valid_date(date)
        return true if date == Float::INFINITY
        return !!(date =~ /^\d{4}\-\d{2}\-\d{2}$/)
    end

    def valid_time(time)
        return true if time == Float::INFINITY
        return !!(time =~ /^\d{2}\:\d{2}\:\d{2}$/)
    end

    def schedule_start_parsed_time
        if self.schedule && self.schedule.first != -Float::INFINITY
            Time.at(self.schedule.first)
        else
            nil
        end
    end

    def schedule_end_parsed_time
        if self.schedule && self.schedule.last != Float::INFINITY
            Time.at(self.schedule.last)
        else
            nil
        end
    end

    def set_schedule!
        # build the start_date
        if schedule_start_date
            if schedule_start_time
                start_time = Time.parse("#{schedule_start_date} #{schedule_start_time}").to_i
            else
                start_time = Time.parse("#{schedule_start_date} 00:00:00").to_i
            end
        else
            start_time = BigDecimal.new("-1.0")/ BigDecimal.new("0.0")
        end

        if schedule_end_date
            if schedule_end_time
                end_time = Time.parse("#{schedule_end_date} #{schedule_end_time}").to_i
            else
                end_time = Time.parse("#{schedule_end_date} 24:00:00").to_i
            end
        else
            end_time = BigDecimal.new("1.0")/ BigDecimal.new("0.0")
        end
        puts "start_time #{start_time} end_time #{end_time}"
        self.schedule = Range.new(start_time, end_time)
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

    def apply_customer_filters(customer, device)
        # this can be a module since it will be used in push messages
        # and experiences
        # need a common way to store these filters
        true
    end

    def within_message_limits(message_rate_index)
        return true if message_rate_index.nil?
        #  message_rate_index
        #  {"1" => {1: 4, 2: 1, 3: 1}}
        #  within 1 day we have 4 messages within 2 days we have 1 message etc..
        #  describes how many of these messages the user has received
        # loop through all limits
        limits.all? do |limiter|
            message_rate_index[limiter.number_of_days] < limiter.message_limit
        end
    end

    def has_message_limits
        limits.any?
    end

    private

    def within_message_limit_per_day(current_message_rate_per_day)
        if self.limit_per_day
            current_message_rate_per_day < self.limit_per_day
        else
            true
        end
    end

    def within_message_limit_per_week(current_message_rate_per_week)
        if self.limit_per_week
            current_message_rate_per_week < self.limit_per_week
        else
            true
        end
    end

    def within_message_limit_per_month(current_message_rate_per_month)
        if self.limit_per_month
            current_message_rate_per_month < self.limit_per_month
        else
            true
        end
    end

    def within_message_limit_per_year(current_message_rate_per_year)
        if self.limit_per_year
            current_message_rate_per_year < self.limit_per_year
        else
            true
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
end

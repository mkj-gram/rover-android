class Message < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include FormattableMessage
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
        # message_rate_index
        # {"1" => {message_per_day: 1, message_per_week: 1}}
        # describes how many of these messages the user has received
        if !message_rate_index.has_key?(self.id)
            message_rate_index[self.id] = {
                messages_per_day: 0,
                messages_per_week: 0,
                messages_per_month: 0,
                messages_per_year: 0
            }
        end
        (
            within_message_limit_per_day(message_rate_index[self.id][:messages_per_day]) &&
            within_message_limit_per_week(message_rate_index[self.id][:messages_per_week]) &&
            within_message_limit_per_month(message_rate_index[self.id][:messages_per_month]) &&
            within_message_limit_per_year(message_rate_index[self.id][:messages_per_year])
        )
    end

    def has_message_limits
        !(
            self.limit_per_day.nil? ||
            self.limit_per_week.nil? ||
            self.limit_per_month.nil? ||
            self.limit_per_year.nil?
        )
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
            !location.nil? && (filter_location_tags - location.tags)
        elsif filter_location_ids && filter_location_ids.any?
            !location.nil? && filter_location_ids.include?(location.id)
        else
            true
        end
    end
end

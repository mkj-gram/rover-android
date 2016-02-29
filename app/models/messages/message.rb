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

    private

    def filter_beacon_configuration(configuration)
        if configuration.is_a?(BeaconConfiguration)
            if filter_beacon_configuration_tags.any?
                configuration.tags == filter_beacon_configuration_tags
            elsif filter_beacon_configuration_ids.any?
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
        if filter_location_tags.any?
            location.tags == filter_location_tags
        elsif filter_location_ids.any?
            filter_location_ids.include?(location.id)
        else
            true
        end
    end

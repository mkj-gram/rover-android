class Location < ActiveRecord::Base
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    settings index: {
        number_of_shards: 1,
        number_of_replicas: 2,
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
    } do

        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :formatted_address, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :tags, type: 'string', index: 'not_analyzed'
            indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
            indexes :location, type: "geo_point"
            indexes :enabled, type: 'boolean', index: 'not_analyzed'
            indexes :created_at, type: 'date'
        end

    end

    belongs_to :account, counter_cache: :searchable_locations_count

    has_many :beacon_configurations

    after_save :update_beacon_configurations_elasticsearch_document

    def as_indexed_json(options = {})
        {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            enabled: self.enabled,
            shared: self.shared,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            beacon_configurations_count: self.beacon_configurations_count
        }
    end

    def shared_account_ids
        []
    end

    private



    def update_beacon_configurations_elasticsearch_document
        # only if the name has changed do we need to update the elasticsearch documents of the beacons
        # who are attached to this
        if changes.include?(:title)
            beacon_configurations.each do |config|
                config.__elasticsearch__.update_document_attributes({location: {name: self.title, id: self.id}})
            end
        end
    end
end

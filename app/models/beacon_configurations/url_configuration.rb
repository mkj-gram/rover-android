class UrlConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name BeaconConfiguration.index_name
    document_type "url_configuration"

    settings index: { number_of_shards: 1 } do
        mapping dynamic: false do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :title, type: 'string', analyzer: 'english'
            indexes :tags, type: 'string'
            indexes :shared_account_ids, type: 'long'
            indexes :created_at, type: 'date'
            indexes :url, type: 'string', index: 'not_analyzed'
        end
    end


    after_create :incremement_counter_cache
    after_destroy :decrement_counter_cache

    before_validation :clear_unused_attributes
    validates :url, presence: true

    def as_indexed_json(options = {})
        json = {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            url: self.url,
            enabled: self.enabled,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            location: self.indexed_location
        }

        MultiJson.dump(json)
    end

    def self.protocol
        @protocol ||= "url"
    end


    private

    def incremement_counter_cache
        super(:ibeacon_configurations_count)
    end

    def decrement_counter_cache
        super(:ibeacon_configurations_count)
    end

    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :uuid, :major, :minor]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end

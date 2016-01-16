class EddystoneNamespaceConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name BeaconConfiguration.index_name
    document_type "eddystone_namespace_configuration"

    settings index: {
        number_of_shards: 1,
        analysis: BeaconConfiguration.autocomplete_analysis
    } do
        mapping do
            indexes :account_id, type: 'long', index: 'not_analyzed'
            indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
            indexes :tags, type: 'string'
            indexes :namespace, type: 'string', index: 'not_analyzed'
            indexes :instance_id, type: 'string', index: 'not_analyzed'
            indexes :created_at, type: 'date'
        end
    end

    after_create :incremement_counter_cache
    after_destroy :decrement_counter_cache

    before_validation :clear_unused_attributes

    validates :namespace, presence: true
    validates :instance_id, presence: true


    def as_indexed_json(options = {})
        json = {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            namespace: self.namespace,
            instance_id: self.instance_id.to_s,
            enabled: self.enabled,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            location: self.indexed_location
        }

        MultiJson.dump(json)
    end


    def self.protocol
        @protocol ||= "Eddystone"
    end

    def as_indexed_json(options = {})
        json = {
            account_id: self.account_id,
            title: self.title,
            tags: self.tags,
            namespace: self.namespace,
            instance_id: self.instance_id,
            enabled: self.enabled,
            created_at: self.created_at,
            shared_account_ids: self.shared_account_ids,
            location: self.indexed_location
        }

        MultiJson.dump(json)
    end

    private

    def incremement_counter_cache
        super(:eddystone_namespace_configurations_count)
    end

    def decrement_counter_cache
        super(:eddystone_namespace_configurations_count)
    end

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end

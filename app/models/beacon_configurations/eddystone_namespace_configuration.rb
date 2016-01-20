class EddystoneNamespaceConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name BeaconConfiguration.index_name
    document_type "eddystone_namespace_configuration"

    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string', index: 'not_analyzed'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :namespace, type: 'string', analyzer: "lowercase_keyword", search_analyzer: "lowercase_keyword"
        indexes :instance_id, type: 'string', index: 'not_analyzed'
        indexes :created_at, type: 'date'
        # didn't get to work but we should learn this for future
        indexes :suggest_tags, type: 'completion', analyzer: 'simple', search_analyzer: 'simple', payloads: false, context: {
            account_id: {
                type: "category",
                path: "account_id"
            },
            shared_account_ids: {
                type: "category",
                path: "shared_account_ids"
            }
        }
    end


    before_validation :clear_unused_attributes
    before_validation :upcase_namespace

    validates :namespace, presence: true
    validates :instance_id, presence: true


    def as_indexed_json(options = {})
        json = super(options)
        json.merge!(
            {
                namespace: self.namespace,
                instance_id: self.instance_id.to_s,
            }
        )
        return json
    end


    def self.protocol
        @protocol ||= "Eddystone"
    end

    private

    def upcase_namespace
        self.namespace.upcase
    end

    def clear_unused_attributes
        blacklist_attributes = [:uuid, :major, :minor, :url]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end

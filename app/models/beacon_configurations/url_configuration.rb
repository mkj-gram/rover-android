class UrlConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name BeaconConfiguration.index_name
    document_type "url_configuration"


    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :url, type: 'string', index: 'not_analyzed'
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
    validates :url, presence: true

    def as_indexed_json(options = {})
        json = super(options)
        json.merge!(
            {
                url: self.url
            }
        )
        return json
    end

    def self.protocol
        @protocol ||= "url"
    end


    private

    def clear_unused_attributes
        blacklist_attributes = [:namespace, :instance_id, :uuid, :major, :minor]
        blacklist_attributes.each {|attr| self[attr] = nil }
    end
end

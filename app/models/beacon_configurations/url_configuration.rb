class UrlConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks
    include UrlAttributes

    index_name BeaconConfiguration.index_name
    document_type "url_configuration"


    mapping dynamic: false do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string', index: 'not_analyzed'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :url, type: 'string', index: 'not_analyzed'
        indexes :created_at, type: 'date'
        indexes :devices_meta, type: 'object' do
            indexes :type, type: 'string', index: "no"
            indexes :count, type: 'integer', index: "no"
        end
        # indexes :devices_meta, type: 'nested', index: 'no'
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
        @protocol ||= "URL"
    end

    def beacon_devices
        @beacon_devices ||= []
    end

end

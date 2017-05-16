class UrlConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include UrlAttributes
    include BeaconConfigurationElasticsearchChild

    document_type "url_configuration"


    mapping dynamic: false do
        indexes :url, type: 'string', index: 'not_analyzed'
    end

    validates :url, presence: true, uniqueness: true

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

    def protocol
        UrlConfiguration.protocol
    end

    def beacon_devices
        @beacon_devices ||= BeaconDevice.none
    end

end

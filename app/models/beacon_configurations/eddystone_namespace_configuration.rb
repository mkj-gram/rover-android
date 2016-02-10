class EddystoneNamespaceConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include EddystoneNamespaceAttributes

    after_commit on: [:create, :update] do
        __elasticsearch__.index_document
    end

    after_commit on: [:destroy] do
        __elasticsearch__.delete_document
    end

    index_name BeaconConfiguration.index_name
    document_type "eddystone_namespace_configuration"

    mapping do
        indexes :account_id, type: 'long', index: 'not_analyzed'
        indexes :title, type: 'string', analyzer: "autocomplete", search_analyzer: "simple"
        indexes :tags, type: 'string', index: 'not_analyzed'
        indexes :shared_account_ids, type: 'long', index: 'not_analyzed'
        indexes :location, type: 'object' do
            indexes :name, type: 'string', index: 'no'
            indexes :id, type: 'integer', index: 'no'
        end
        indexes :namespace, type: 'string', analyzer: "lowercase_keyword", search_analyzer: "lowercase_keyword"
        indexes :instance_id, type: 'string', index: 'not_analyzed'
        indexes :created_at, type: 'date'
        indexes :devices_meta, type: 'object' do
            indexes :type, type: 'string', index: "no"
            indexes :count, type: 'integer', index: "no"
        end
        # didn't get to work but we should learn this for future
        # indexes :suggest_tags, type: 'completion', analyzer: 'simple', search_analyzer: 'simple', payloads: false, context: {
        #     account_id: {
        #         type: "category",
        #         path: "account_id"
        #     },
        #     shared_account_ids: {
        #         type: "category",
        #         path: "shared_account_ids"
        #     }
        # }
    end

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

    def protocol
        EddystoneNamespaceConfiguration.protocol
    end

    def beacon_devices
        BeaconDevice.where(account_id: self.account_id, namespace: self.namespace, instance_id: self.instance_id)
    end


end

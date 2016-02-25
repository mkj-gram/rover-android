class EddystoneNamespaceConfiguration < BeaconConfiguration
    include Elasticsearch::Model
    include EddystoneNamespaceAttributes
    include BeaconConfigurationElasticsearchMappings


    document_type "eddystone_namespace_configuration"

    mapping do
        indexes :namespace, type: 'string', analyzer: "lowercase_keyword", search_analyzer: "lowercase_keyword"
        indexes :instance_id, type: 'string', index: 'not_analyzed'
    end

    after_save :update_active_uuids

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

    private

    def update_active_uuids
        if self.changes.include?(:namespace)
            ActiveEddystoneConfigurationUuid.update_uuids(self.account_id, [namespace_was], [namespace])
        end
    end
end

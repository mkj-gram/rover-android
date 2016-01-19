urls = Rails.configuration.elasticsearch["urls"]
Elasticsearch::Model.client = Elasticsearch::Client.new(hosts: urls)

# make sure the mappings exist on startup since sti is not really supported with elasticsearch rails

client = BeaconConfiguration.__elasticsearch__.client
if !client.indices.exists?(index: BeaconConfiguration.index_name)
    client.indices.create(index: BeaconConfiguration.index_name, body: BeaconConfiguration.settings.to_hash)
    client.indices.put_mapping(index: BeaconConfiguration.index_name, type: IBeaconConfiguration.document_type, body: IBeaconConfiguration.mappings.to_hash)
    client.indices.put_mapping(index: BeaconConfiguration.index_name, type: EddystoneNamespaceConfiguration.document_type, body: EddystoneNamespaceConfiguration.mappings.to_hash)
    client.indices.put_mapping(index: BeaconConfiguration.index_name, type: UrlConfiguration.document_type, body: UrlConfiguration.mappings.to_hash)
end

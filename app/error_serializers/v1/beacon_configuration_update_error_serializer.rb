class V1::BeaconConfigurationUpdateErrorSerializer < ModelError::Serializer
    attribute :uuid
    attribute :major
    attribute :minor

    attribute :namespace
    attribute :instance_id, error_key: :"instance-id"

    attribute :url
end

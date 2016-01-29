class V1::BeaconConfigurationCreateErrorSerializer < ModelError::Serializer
    attribute :uuid
    attribute :major
    attribute :minor
end

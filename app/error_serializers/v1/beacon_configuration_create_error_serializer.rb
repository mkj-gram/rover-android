class V1::BeaconConfigurationCreateErrorSerializer < ModelError::Serializer
    attribute :uuid
    attribute :major, error_key: :"major-number"
    attribute :minor, error_key: :"minor-number"
end

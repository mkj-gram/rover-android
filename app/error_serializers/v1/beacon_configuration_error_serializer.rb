class V1::BeaconConfigurationErrorSerializer < ModelError::Serializer
    attribute :uuid
    attribute :major, error_key: :"major-number"
    attribute :minor, error_key: :"minor-number"

    attribute :namespace
    attribute :instance_id, error_key: :"instance-id"

    attribute :url

    attribute :location_id, error_key: :location, relationship: true
end

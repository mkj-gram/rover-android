class V1::BeaconConfigurationErrorSerializer < ModelError::Serializer
    attribute :title, error_key: :name
    attribute :uuid
    attribute :major, error_key: :"major-number"
    attribute :minor, error_key: :"minor-number"

    attribute :namespace
    attribute :instance_id, error_key: :"instance-id"

    attribute :url

    attribute :place_id, error_key: :place, relationship: true
end

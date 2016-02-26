class V1::ProximityMessageErrorSerializer < ModelError::Serializer
    attribute :title, error_key: :name
end

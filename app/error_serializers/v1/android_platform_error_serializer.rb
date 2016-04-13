class AndroidPlatformErrorSerializer < ModelError::Serializer
    attribute :api_key, error_key: "api-key"
end

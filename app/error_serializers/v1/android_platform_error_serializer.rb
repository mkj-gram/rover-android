class AndroidPlatformErrorSerializer < ModelError::Serializer
    attribute :api_key, error_key: "api-key"
    attribute :package_name, error_key: "package-name"
end

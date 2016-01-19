class V1::EstimoteIntegrationModelError < ModelError::Serializer
    attribute :enabled
    attribute :app_id, error_key: :"app-id"
    attribute :app_token, error_key: :"app-token"
end

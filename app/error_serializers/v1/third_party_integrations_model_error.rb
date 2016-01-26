class V1::ThirdPartyIntegrationsModelError < ModelError::Serializer
    attribute :enabled

    # estimote specific errors
    attribute :app_id, error_key: :"app-id"
    attribute :app_token, error_key: :"app-token"

    # kontakt specific errors
    # attribute :api_key, error_key: :"app-key"
end

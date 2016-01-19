class V1::UserUpdateErrorSerializer < ModelError::Serializer
    attribute :current_password, error_key: "current-password"
    attribute :unauthorized, model_error: true
end

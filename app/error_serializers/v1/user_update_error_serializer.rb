class V1::UserUpdateErrorSerializer < ModelError::Serializer
    attribute :current_password, error_key: "current-password"
    # attribute :unauthorized, error_key: "current-password"
    attribute :password
end

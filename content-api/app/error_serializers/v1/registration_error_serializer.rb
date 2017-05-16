class V1::RegistrationErrorSerializer < ModelError::Serializer
    attribute :account_invite_token, error_key: :token
    attribute :name
    attribute :email
    attribute :password
end

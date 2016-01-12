class V1::PasswordResetErrorSerializer < ModelError::Serializer
    attribute :email
    attribute :password
end

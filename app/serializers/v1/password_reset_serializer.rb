class V1::PasswordResetSerializer < ActiveModel::Serializer
    attributes :email, :expires_at
end

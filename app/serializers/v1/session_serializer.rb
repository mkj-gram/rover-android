class V1::SessionSerializer < ActiveModel::Serializer
    attributes :token, :expires_at
end

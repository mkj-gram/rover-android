class V1::UserSerializers::CreateSerializer < ActiveModel::Serializer
    attributes :id, :name, :email, :created_at, :updated_at
    belongs_to :account
    has_one :session

    link :self do
        href scope.v1_user_url(object.id)
    end

end

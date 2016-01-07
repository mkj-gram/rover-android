class V1::UserSerializers::IndividualSerializer < ActiveModel::Serializer
    attributes :id, :name, :email, :created_at, :updated_at
    belongs_to :account
    link :self do
        href scope.v1_user_url(object.id)
    end
end

class V1::LocationErrorSerializer < ModelError::Serializer

    attribute :title, error_key: :name
    attribute :address
    attribute :city
    attribute :provice
    attribute :country
    attribute :radius
    attribute :longitude
    attribute :latitude

end

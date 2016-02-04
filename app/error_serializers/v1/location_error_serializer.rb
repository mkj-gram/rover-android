class V1::LocationErrorSerializer < ModelError::Serializer

    attribute :title, error_key: :name
    attribute :address
    attribute :city
    attribute :province
    attribute :country
    attribute :radius
    attribute :longitude
    attribute :latitude
    attribute :google_place_id, error_key: :"google-place-id"
end

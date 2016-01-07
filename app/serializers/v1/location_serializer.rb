class V1::LocationSerializer < ActiveModel::Serializer
    # t.integer :account_id, null: false
    # t.text :name
    # t.text :address
    # t.text :city
    # t.text :province_state
    # t.text :postal_zip
    # t.text :country
    # t.decimal :latitude
    # t.decimal :longitude
    # t.integer :radius
    # t.text :google_place_id
    # t.text :tags
    attributes :id, :name, :address, :city, :province_state, :postal_zip, :country, :latitude, :longitude, :radius, :google_place_id, :tags

end

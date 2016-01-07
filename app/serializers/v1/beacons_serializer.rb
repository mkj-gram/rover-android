class V1::BeaconsSerializer < ActiveModel::Serializer
    attribute :name

    link :self do
        # href "#{scope.v1_location_relationships_beacon_url(object.location_id, object.id)}"
    end

end

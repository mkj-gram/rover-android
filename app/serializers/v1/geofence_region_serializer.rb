class V1::GeofenceRegionSerializer < ActiveModel::Serializer

    attributes :longitude, :latitude, :radius
end

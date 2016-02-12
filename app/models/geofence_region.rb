class GeofenceRegion < ActiveModelSerializers::Model
    include Virtus.model

    attribute :id, String
    attribute :longitude, Float
    attribute :latitude, Float
    attribute :radius, Integer

    def serialize
        {
            type: "geofence-regions",
            id: "#{latitude}:#{longitude}",
            attributes: {
                latitude: latitude,
                longitude: longitude,
                radius: radius
            }
        }
    end

end

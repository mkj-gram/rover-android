class GeofenceRegion
    include Virtus.model

    attribute :id, String
    attribute :longitude, Float
    attribute :latitude, Float
    attribute :radius, Integer


    def initialize(attributes = {})
        if attributes.is_a?(String)
            latitude, longitude, radius = attributes.split(":")
            super(latitude: latitude.to_f, longitude: longitude.to_f, radius: radius.to_f)
        else
            super
        end
    end

    def id
        "#{latitude}:#{longitude}:#{radius}"
    end

    def serialize
        {
            type: "geofence-regions",
            id: id,
            attributes: {
                latitude: latitude,
                longitude: longitude,
                radius: radius
            }
        }
    end

end

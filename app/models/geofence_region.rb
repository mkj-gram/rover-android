class GeofenceRegion
    include Virtus.model

    attribute :id, String
    attribute :longitude, Float
    attribute :latitude, Float
    attribute :radius, Integer


end

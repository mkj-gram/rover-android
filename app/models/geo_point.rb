class GeoPoint
    include Virtus.model

    attribute :latitude,  Float
    attribute :longitude, Float

    # def initialize(lat, lng)
    #     @lat, @lng = lat, lng
    # end

    def distance(geo_point)
        GeoPoint.distance_between(self, geo_point)
    end

    def to_doc
        [self.latitude, self.longitude]
    end

    def eq?(other)
        self == other
    end

    def equal?(other)
        self == other
    end

    def ==(other)
        self.latitude == other.latitude && self.longitude == other.longitude
    end

    class << self

        def rad_per_deg
            @rad_per_deg ||= Math::PI/180  # PI / 180
        end

        # returns the distance in metres between 2 geo points using Haversine formula
        def distance_between(geo_point1,  geo_point2)
            # rkm = 6371                  # Earth radius in kilometers
            # rm = rkm * 1000 = 6371000   # Radius in meters
            dlat_rad = (geo_point2.lat - geo_point1.lat) * rad_per_deg  # Delta, converted to rad
            dlng_rad = (geo_point2.lng - geo_point1.lng) * rad_per_deg

            lat1_rad = geo_point1.lat * rad_per_deg
            lat2_rad = geo_point2.lat * rad_per_deg

            lng1_rad = geo_point1.lng * rad_per_deg
            lng2_rad = geo_point2.lng * rad_per_deg

            a = Math.sin(dlat_rad/2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlng_rad/2)**2
            c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1-a))

            return 6371000 * c
        end

        def from_document(doc)
            GeoPoint.new(latitude: doc.first, longitude: doc.last)
        end
    end
end

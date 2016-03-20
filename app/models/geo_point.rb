class GeoPoint

    attr_reader :lat, :lng

    def initialize(lat, lng)
        @lat, @lng = lat, lng
    end

    def mongoize
        [ lat, lng ]
    end

    class << self

        def demongoize(object)
            return nil if object.nil?
            GeoPoint.new(object[0], object[1])
        end

        def mongoize(object)
            case object
            when GeoPoint then object.mongoize
            when Hash then GeoPoint.new(object[:lat], object[:lng]).mongoize
            else object
            end
        end

        def evolve(object)
            case object
            when GeoPoint then object.mongoize
            else object
            end
        end
    end

end

module GeoFilter

    class GeoBoundingBox
        class InvalidBoundsFormat < StandardError
        end

        def initialize(bounds_param)
            bounds_param = bounds_param.split(",") if bounds_param.is_a?(String)
            if bounds_param.is_a?(Array)
                if bounds_param.size == 4
                    @north, @east, @south, @west = bounds_param.map(&:to_f)
                elsif bounds_param.size == 2 && bounds_param.first.is_a?(Array) && bounds_param.second.is_a?(Array)
                    @north, @east = bounds_param.first.map(&:to_f)
                    @south, @west = bounds_param.second.map(&:to_f)
                else
                    raise InvalidBoundsFormat, "bounds was an array but the server could not understand the format"
                end
            else
                raise InvalidBoundsFormat, "bounds must be an array in the format [north, east, south, west"
            end

            raise InvalidBoundsFormat, "bounds[north] must be between -90 and 90" if !@north.between?(-90,90)
            raise InvalidBoundsFormat, "bounds[south] must be between -90 and 90" if !@south.between?(-90,90)
            raise InvalidBoundsFormat, "bounds[east] must be between -180 and 180" if !@east.between?(-180,180)
            raise InvalidBoundsFormat, "bounds[west] must be between -180 and 180" if !@west.between?(-180,180)

        end

        def to_elasticsearch_filter(attribute)
            {
                "geo_bounding_box" => {
                    "type" => "indexed",
                    attribute => {
                        "top_left" => {
                            "lat" => @north,
                            "lon" => @west
                        },
                        "bottom_right" => {
                            "lat" => @south,
                            "lon" => @east
                        }
                    }
                }
            }
        end
    end

    class GeoDistanceFilter

        def initialize(geo_point)
        end

        def to_elasticsearch_filter

        end
    end

end

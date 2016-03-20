module CustomerFilter
    module Comparers
        class GeoPoint < Comparer

            attr_reader :longitude, :latitude, :radius

            def initialize(opts)
                super
                @latitude = opts["latitude"]
                @longitude = opts["longitude"]
                @radius = opts["radius"] || 100
            end

            def extra_opts
                if longitude && latitude && radius
                    {"longitude" => longitude, "latitude" => latitude, "radius" => radius}
                else
                    {}
                end
            end

            def check(v)
                false
            end

            def get_elasticsearch_query(attribute_name)
                case @method
                when Comparers::Methods::ANY_VALUE
                    {}
                when Comparers::Methods::UNKNOWN_VALUE
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        missing: {
                                            field: attribute_name
                                        }
                                    }
                                ]
                            }

                        }
                    }
                when Comparers::Methods::GEOFENCE
                    {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        geo_distance: => {
                                            distance: radius,
                                            distance_unit: "m"
                                            attribute_name => {
                                                lat: latitude,
                                                lon: longitude
                                            }
                                        }
                                    }
                                ]
                            }

                        }
                    }
                else
                    {}
                end
            end
        end
    end
end

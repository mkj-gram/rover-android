module CustomerFilter
    module Comparers
        class Geofence < Comparer

            attr_reader :longitude, :latitude, :radius

            def initialize(opts)
                super
                @latitude = opts["latitude"]
                @longitude = opts["longitude"]
                @radius = opts["radius"] || 100
            end

            def dump
                opts = super

                opts.delete("value")
                opts.merge!(
                    {
                        "longitude" => longitude,
                        "latitude" => latitude,
                        "radius" => radius
                    }
                )

                return opts
            end

            def geo_point
                @geo_point ||= ::GeoPoint.new(latitude: latitude, longitude: longitude)
            end

            def check(v)
                case @method
                when Comparers::Methods::ANY_VALUE
                    true
                when Comparers::Methods::UNKNOWN_VALUE
                    v.nil?
                when Comparers::Methods::GEOFENCE
                    if v.nil?
                        false
                    else
                        device_geo_point = ::GeoPoint.new(latitude: v.latitude, longitude: v.longitude)
                        # v is the customers current geo_point
                        distance = ::GeoPoint.distance_between(device_geo_point, geo_point)
                        distance <= radius
                    end
                else
                    false
                end
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
                                        geo_distance: {
                                            distance: radius,
                                            distance_unit: "m",
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

module GeoFilterHelper

    class GeoBoundingBoxFilter
        def self.can_build?(location_params)
            !(
                location_params.dig(:"bbox", :"top-left", :lat).nil? ||
                location_params.dig(:"bbox", :"top-left", :lng).nil? ||
                location_params.dig(:"bbox", :"bottom-right", :lat).nil? ||
                location_params.dig(:"bbox", :"bottom-right", :lng).nil?
            )
        end

        def self.build(location_params)
            top_left = [location_params.dig(:"bbox", :"top-left", :lat), location_params.dig(:"bbox", :"top-left", :lng)]
            bottom_right = [location_params.dig(:"bbox", :"bottom-right", :lat), location_params.dig(:"bbox", :"bottom-right", :lng)]
            self.new(top_left, bottom_right)
        end

        def initialize(top_left, bottom_right)
            @top_left = top_left
            @bottom_right = bottom_right
        end

        def to_elasticsearch_filter(attribute)
            {
                "geo_bounding_box" => {
                    "type" => "indexed",
                    attribute => {
                        "top_left" => {
                            "lat" => @top_left[0],
                            "lon" => @top_left[1]
                        },
                        "bottom_right" => {
                            "lat" => @bottom_right[0],
                            "lon" => @bottom_right[1]
                        }
                    }
                }
            }
        end
    end

    class GeoDistanceFilter
        def self.can_build?(location_params)
        end
        def initialize(geo_point)
        end

        def to_elasticsearch_filter

        end
    end


    @@filters = [GeoFilterHelper::GeoBoundingBoxFilter, GeoFilterHelper::GeoDistanceFilter]

    # params expect key :location
    def get_geo_filter(params)
        return nil if !params.has_key?(:location)
        filter = get_filter(params[:location])
        return filter
    end

    private

    def get_filter(location_params)
        @@filters.each{|filter| return filter.build(location_params) if filter.can_build?(location_params)}
    end





end

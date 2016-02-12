class LocationEvent < Event

    def self.create_event(event_attributes)
        LocationUpdateEvent.new(event_attributes)
    end
    # type is location
    # action update
    # going to get longitude latitude radius
    #
    #
    # want to return geogences they should be monitoring for
    # if a specifc location doesn't exist
    # we search for the closest one?

    attr_reader :longitude, :latitude, :radius, :region_limit



    def initialize(event_attributes)
        super
        @longitude = event_attributes[:longitude]
        @latitude = event_attributes[:latitude]
        @radius = event_attributes[:radius]
        @region_limit = device.os_name == "iOS" ? 20 : 100
    end


    def json_response
        json = super
        json[:data][:attributes].merge!({latitude: latitude, longitude: longitude, radius: radius})
        return json
    end

    private

    def location
        @location ||= Location.where(latitude: latitude, longitude: longitude).first
    end

    def closest_geofence_regions(limit = 20)
        query = {
            query: {
                filtered: {
                    filter: {
                        bool: {
                            should: [
                                {
                                    term: { account_id: account.id }
                                },
                                {
                                    term: { shared_account_ids: account.id }
                                }
                            ],
                            must: [
                                {
                                    term: { enabled: true }
                                }
                            ]
                        }
                    }
                }
            },
            sort:  [
                {
                    :"_geo_distance" => {
                        location: {
                            lat: latitude,
                            lon: longitude
                        },
                        order: "asc",
                        unit: "km",
                        :"distance_type" => "plane"
                    }
                }
            ]
        }

        locations = Elasticsearch::Model.search(query, [Location])
        locations.per_page(limit).page(0).results
    end

end

class Event

    def self.build_event(event_attributes)
        object = event_attributes[:object]
        action = event_attributes[:action]
        case object
        when "location"
            return LocationEvent.build_event(object, action, event_attributes)
        when "beacon-region"
            return BeaconRegionEvent.build_event(object, action, event_attributes)
        else
            return Event.new(event_attributes)
        end

    end


    attr_reader :account, :customer, :device, :object, :action

    def initialize(event_attributes)
        @account = event_attributes[:account]
        @object = event_attributes[:object]
        @action = event_attributes[:action]
        @customer = event_attributes[:customer]
        @device = event_attributes[:device]
    end

    def save

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
        locations.per_page(limit).page(0).results.map do |document|
            latitude = document._source.location.lat
            longitude = document._source.location.lon
            radius = document._source.radius
            GeofenceRegion.new(latitude: latitude, longitude: longitude, radius: radius)
        end
    end

    def ibeacon_wildcard_regions
        @ibeacon_wildcard_regions ||= account.ibeacon_configuration_uuids.configuration_uuids.map{|uuid| IBeaconRegion.new(uuid: uuid)}
    end

    def json_response
        {
            data: {
                type: "events",
                id: rand(99999),
                attributes: {
                    object: object,
                    action: action
                }
            }
        }
    end
end

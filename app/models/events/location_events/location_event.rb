class LocationEvent < Event

    after_save :update_customer_location

    def self.event_id
        Event::LOCATION_EVENT_ID
    end

    def self.build_event(object, action, event_attributes)
        case action
        when "update"
            LocationUpdateEvent.new(event_attributes)
        else
            return Event.new(event_attributes)
        end
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
        @region_limit = device.ios? ? 20 : 100
    end

    def update_customer_location
        if customer
            customer.update_attributes({last_known_location: GeoPoint.new(latitude, longitude)})
        end
    end

    private

    def location
        @location ||= Location.where(latitude: latitude, longitude: longitude).first
    end

end

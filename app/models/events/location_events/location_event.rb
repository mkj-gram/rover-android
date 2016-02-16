class LocationEvent < Event

    def self.build_event(object, action, event_attributes)
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

end

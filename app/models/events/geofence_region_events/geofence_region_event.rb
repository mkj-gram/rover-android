class GeofenceRegionEvent < Event

    def self.build_event(object, action, event_attributes)
        case action
        when "enter"
            return GeofenceRegionEnterEvent.new(event_attributes)
        when "exit"
            return GeofenceRegionExitEvent.new(event_attributes)
        else
            return Event.new(event_attributes)
        end
    end

    attr_reader :identifier_latitude, :identifier_longitude, :longitude, :latitude, :radius

    def initialize(event_attributes)
        super
        @identifier_latitude, @identifier_longitude = event_attributes[:identifier].split(":")
        @latitude = event_attributes[:latitude]
        @longitude = event_attributes[:longitude]
        @radius = event_attributes[:radius]
    end

    def save
        super
    end

    def to_json
        json = super
        # should have a location tied to it
        if location && location.enabled
            json[:data][:attributes][:location] = {
                name: location.title,
                latitude: location.latitude,
                longitude: location.longitude,
                radius: location.radius,
                tags: location.tags,
                shared: location.shared
            }
        else
            json[:data][:attributes][:location] = {}
        end

        return json
    end

    private

    def location
        @location ||= -> {
            if identifier_latitude && identifier_longitude
                Location.find_by(latitude: identifier_latitude, longitude: identifier_longitude)
            else
                Location.find_by(latitude: latitude, longitude: longitude)
            end
        }.call
    end

end

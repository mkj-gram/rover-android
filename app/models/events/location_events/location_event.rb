module Events
    module LocationEvents
        class LocationEvent < Event

            before_save :set_device_location

            def self.event_id
                Event::LOCATION_EVENT_ID
            end

            attr_reader :longitude, :latitude, :accuracy, :region_limit

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @longitude = event_attributes[:longitude]
                @latitude = event_attributes[:latitude]
                @accuracy = event_attributes.has_key?(:accuracy) ? event_attributes[:accuracy] : event_attributes[:radius]
                @region_limit = device.ios? ? 20 : 100
            end

            def set_device_location
                new_location = Snapshots::Location.new(latitude: latitude, longitude: longitude, accuracy: accuracy)
                if device.location && device.location != new_location
                    distance = device.location.distance_between(new_location)
                    MetricsClient.aggregate("events.#{object}.#{action}.distance" => { value: distance })
                    if (distance >= 250 && new_location.accuracy <= 250) || distance >= 1000
                        device.location = new_location
                    end
                elsif device.location.nil?
                    device.location = new_location
                end
            end

            private

            def place
                @place ||= Place.where(latitude: latitude, longitude: longitude).first
            end

        end

    end
end

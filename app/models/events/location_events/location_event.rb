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
                @new_location = Snapshots::Location.new(latitude: @latitude, longitude: @longitude, accuracy: @accuracy)
            end

            def should_process_event
                if device.location && device.location != @new_location
                    distance = device.location.distance_between(@new_location)
                    MetricsClient.aggregate("events.#{object}.#{action}.distance" => { value: distance, source: device.platform }) if distance
                    MetricsClient.aggregate("events.#{object}.#{action}.accuracy" => { value: @new_location.accuracy, source: device.platform }) if @new_location.accuracy
                    if distance >= 50 && !@new_location.accuracy.nil? && @new_location.accuracy <= 200 || distance > 5000
                        MetricsClient.aggregate("events.#{object}.#{action}.processed" => { value: 1, source: device.platform })
                        return true
                    else
                         MetricsClient.aggregate("events.#{object}.#{action}.dropped" => { value: 1, source: device.platform })
                         return false
                    end
                elsif device.location.nil?
                    return true
                end

                return false
            end

            def set_device_location
                device.location = @new_location
            end

            private

            def place
                @place ||= Place.where(latitude: latitude, longitude: longitude).first
            end

        end

    end
end

class GeofenceRegionEvent < Event

    after_save :save_messages_to_inbox

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

    attr_reader :geofence_region, :identifier_longitude, :longitude, :latitude, :radius

    def initialize(event_attributes)
        super
        @geofence_region = GeofenceRegion.new(event_attributes[:identifier])
        @latitude = event_attributes[:latitude]
        @longitude = event_attributes[:longitude]
        @radius = event_attributes[:radius]
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

            if new_messages.any?
                json[:included] += new_messages.map{|message| V1::InboxMessageSerializer.serialize(message)}
            end
        else
            json[:data][:attributes][:location] = {}
        end

        return json
    end

    private

    def save_messages_to_inbox
        # TODO Refractor both beacon_region_event and location_event use the same structure
        puts "after save"
        @proximity_messages = get_message_for_location(location) || []
        if @proximity_messages && @proximity_messages.any?
            messages_to_deliver = @proximity_messages.map{|message| message.to_inbox_message(message_opts)}
            @new_messages = customer.inbox.add_messages(messages_to_deliver, account) if messages_to_deliver.any?
        end
    end

    def get_message_for_location(location_configuration)
        messages = ProximityMessage.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", self.generation_time.to_i).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
        # apply all filters
        current_time = DateTime.now
        messages.select do |message|
            message.within_schedule(current_time) && message.apply_configuration_filters(location_configuration) && message.apply_customer_filters(customer, device)
        end
    end

    def location
        @location ||= -> {
            if geofence_region && geofence_region.latitude && geofence_region.latitude
                return Location.find_by(latitude: geofence_region.latitude , longitude: geofence_region.longitude)
            else
                return Location.find_by(latitude: latitude, longitude: longitude)
            end
        }.call
    end

end

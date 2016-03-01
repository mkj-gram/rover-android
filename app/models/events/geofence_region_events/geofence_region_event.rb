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

    def save
        @proximity_messages = get_message_for_location(location) || []
        run_callbacks :save
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
                json[:included] += new_messages.map{|message| serialize_inbox_message(message)}
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
        if @proximity_messages && @proximity_messages.any?
            messages_to_deliver = @proximity_messages.map{|message| message.to_inbox_message(message_opts)}
            @new_messages = customer.inbox.add_messages(messages_to_deliver, account) if messages_to_deliver.any?
        end
    end

    def get_message_for_location(location_configuration)
        messages = ProximityMessage.where(account_id: account.id, published: true,  trigger_event_id: self.class.event_id).all.to_a
        # apply all filters
        current_time = DateTime.now
        messages.select do |message|
            message.within_schedule(current_time) && message.apply_configuration_filters(location_configuration) && message.apply_customer_filters(customer, device)
        end
    end

    def serialize_inbox_message(message)
        {
            type: "messages",
            id: message.id.to_s,
            attributes: {
                :"notification-text" => message.notification_text,
                read: message.read,
                :"save-to-inbox" => true
            }
        }
    end

    # def serialize_message(message, opts = {})
    #     customer = opts.delete(:customer)
    #     if customer
    #         opts.merge!(customer.attributes.inject({}){|hash, (k,v)| hash.merge("customer_#{k}" => v)})
    #     end
    #     device = opts.delete(:device)
    #     if device
    #         opts.merge!(device.attributes.inject({}){|hash, (k,v)| hash.merge("device_#{k}" => v)})
    #     end
    #     {
    #         type: "messages",
    #         id: message.id.to_s,
    #         attributes: {
    #             text: message.formatted_message(opts)
    #         }
    #     }
    # end

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

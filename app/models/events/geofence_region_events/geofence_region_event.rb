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
        # has to perform all filtering in memory
        # first find all messages where the trigger_event_id is the type of event which occured
        messages = ProximityMessage.where(account_id: account.id, trigger_event_id: self.class.event_id).all.to_a
        # apply all filters
        current_time = DateTime.now
        messages.select do |message|
            # check time
            if message.within_schedule(current_time)
                # we are within schedule
                # check to see if our config fits the message
                if message.apply_configuration_filters(location_configuration)
                    # we also have customer filtering ontop
                    if message.apply_customer_filters(customer, device)
                        true
                    else
                        false
                    end
                else
                    false
                end
            else
                false
            end
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

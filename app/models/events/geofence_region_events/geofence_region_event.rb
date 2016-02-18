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

    attr_reader :geofence_region, :identifier_longitude, :longitude, :latitude, :radius

    def initialize(event_attributes)
        super
        @geofence_region = GeofenceRegion.new(event_attributes[:identifier])
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
            if messages.any?
                json[:included] += messages.map{|message| serialize_message(message,{customer: customer, device: device}) }
            end
        else
            json[:data][:attributes][:location] = {}
        end

        return json
    end

    private

    def messages
        @messages ||= ProximityMessage.where(account_id: account.id, trigger_event_id: self.class.event_id).all.to_a
    end

    def serialize_message(message, opts = {})
        customer = opts.delete(:customer)
        if customer
            opts.merge!(customer.attributes.inject({}){|hash, (k,v)| hash.merge("customer_#{k}" => v)})
        end
        device = opts.delete(:device)
        if device
            opts.merge!(device.attributes.inject({}){|hash, (k,v)| hash.merge("device_#{k}" => v)})
        end
        {
            type: "messages",
            id: message.id.to_s,
            attributes: {
                text: message.formatted_message(opts)
            }
        }
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

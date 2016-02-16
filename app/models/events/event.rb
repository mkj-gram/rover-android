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

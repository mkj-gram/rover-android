class Event
    class << self
        def create_event(attributes)
            return Event.new
        end
    end


    def save
    end

    def json_response
        {
            data: {}
        }
    end
end

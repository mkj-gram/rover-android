module Events
    module Pipeline
        class << self
            @@events = {}
            @@targetable_events = Set.new
            @@lock = Mutex.new
            @@event_string_to_event_id_index = {}
            @@event_id_to_event_string_index = {}

            def register(object, action, model, opts = {})
                # puts "REGISTERING #{object}, #{action}, #{model}"
                @@lock.synchronize {
                    event_string = "#{object}:#{action}"
                    @@events[object] = {} if @@events[object].nil?
                    @@events[object][action] = model
                    @@event_string_to_event_id_index[event_string] = model.event_id
                    @@event_id_to_event_string_index[model.event_id] = event_string
                    if opts[:targetable] == true
                        @@targetable_events.add(model.event_id)
                    end
                }
                # puts @@events
            end

            def build_event(object, action, event_attributes)
                model = @@events.dig(object, action)
                return Event.new(event_attributes) if model.nil?
                return model.new(event_attributes)
            end

            def targetable_event?(event_id)
                return @@targetable_events.include?(event_id)
            end

            def event_string_to_event_id(event_string)
                id = @@event_string_to_event_id_index[event_string]
                return id.nil? ? Events::Constants::UNKNOWN_EVENT_ID : id
            end

            def event_id_to_event_string(event_id)
                return @@event_id_to_event_string_index[event_id]
            end

            def events
                @@events
            end
        end
    end
end

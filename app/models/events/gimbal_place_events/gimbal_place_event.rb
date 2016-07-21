module Events
    module GimbalPlaceEvents
        class GimbalPlaceEvent < Event

       
            def self.event_id
                Event::GIMBAL_PLACE_EVENT_ID
            end

            before_save :save_messages_to_inbox
            
            attr_reader :gimbal_place_id

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @gimbal_place_id = event_attributes[:gimbal_place_id]    
            end


            private

            def save_messages_to_inbox
                @proximity_messages = get_messages
                if @proximity_messages && @proximity_messages.any?
                    deliver_messages(@proximity_messages)
                end
            end

            def get_messages
                message_templates = ProximityMessageTemplate.where(account_id: account.id, published: true, filter_gimbal_place_id: gimbal_place_id, trigger_event_id: self.class.event_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
                # apply all filters
                current_time = DateTime.now
                message_templates.select do |message_template|
                    message_template.within_schedule(current_time) && message_template.apply_gimbal_filters(gimbal_place) && message_template.within_customer_segment(customer, device)
                end
            end

            def gimbal_place
                @gimbal_place ||= GimbalPlace.where(id: gimbal_place_id).first
            end

        end

    end
end

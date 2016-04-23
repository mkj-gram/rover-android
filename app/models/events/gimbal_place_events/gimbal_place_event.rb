module Events
    module GimbalPlaceEvents
        class GimbalPlaceEvent < Event

            before_save :save_messages_to_inbox

            # def self.event_id
            #     Event::BEACON_REGION_EVENT_ID
            # end

            def self.build_event(object, action, event_attributes)
                case action
                when "enter"
                    return GimbalPlaceEnterEvent.new(event_attributes)
                when "exit"
                    return GimbalPlaceExitEvent.new(event_attributes)
                else
                    return Event.new(event_attributes)
                end
            end


            def initialize(event_attributes)
                super
                @place_id = event_attributes["place_id"]
            end

            def attributes
                parent_attributes = super
                if gimbal_place
                    parent_attributes.merge!(
                        {
                            gimbal_place: {
                                id: gimbal_place.id
                            }
                        }
                    )
                end

                if @new_messages && @new_messages.any?
                    messages = @new_messages.map{|inbox_message| inbox_message.message }
                    parent_attributes.merge!(
                        {
                            messages: messages.map{ |message|
                                {
                                    id: message.id,
                                    tags: message.tags,
                                    save_to_inbox: message.save_to_inbox
                                }
                            }
                        }
                    )
                end

                return parent_attributes
            end

            def to_json
                json = super
                if gimbal_place
                    json[:data][:attributes][:"gimbal-place"] = {
                        id: gimbal_place.id,
                        name: gimbal_place.name,
                    }

                    if new_messages.any?
                        json[:included] += new_messages.map{|message| V1::InboxMessageSerializer.serialize(message)}
                    end
                end

                return json
            end


            private

            def save_messages_to_inbox
                puts "after save"
                @proximity_messages = get_messages_for_gimbal_place(gimbal_place) || []
                if @proximity_messages && @proximity_messages.any?
                    # @inbox_messages = @proximity_messages.select{|message| message.save_to_inbox}.map{|message| message.to_inbox_message(message_opts)}
                    # @local_messages = @proximity_messages.select{|message| message.save_to_inbox == false}
                    messages_to_deliver = @proximity_messages.map{|message| message.to_inbox_message(message_opts)}

                    @new_messages = customer.inbox.add_messages(messages_to_deliver, account) if messages_to_deliver.any?
                end
            end

            def get_messages_for_gimbal_place(gimbal_place)
                return nil if gimbal_place.nil?
                # has to perform all filtering in memory
                # first find all messages where the trigger_event_id is the type of event which occured
                messages = ProximityMessageTemplate.where(account_id: account.id, published: true, trigger_event_id: self.class.event_id, filter_gimbal_place_id: @place_id).where(today_schedule_column => true).where("? <@ date_schedule", generation_time_date).where("? <@ time_schedule", generation_time_minutes_since_midnight).all.to_a
                # apply all filters
                current_time = DateTime.now
                messages.select do |message|
                    message.within_schedule(current_time) && message.within_customer_segment(customer, device)
                end
            end

            def gimbal_place
                @gimbal_place ||= account.gimbal_places.find_by_id(@place_id)
            end

        end

    end
end

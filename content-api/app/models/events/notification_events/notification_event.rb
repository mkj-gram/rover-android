module Events
    module NotificationEvents

        class NotificationEvent < Event

        	attr_reader :message, :template

			def initialize(event_attributes, extra)
				super event_attributes, extra
				@message = event_attributes[:message]
                @template = extra[:template]
			end


			def attributes
                parent_attributes = super
                
                if message
                    parent_attributes.merge!(
                        message: {
                            id: message.id,
                            message_template_id: message.message_template_id,
                            notification_text: message.notification_text,
                            ios_title: message.ios_title,
                            android_title: message.android_title,
                            ios_sound_file: message.ios_sound_file,
                            tags: message.tags,
                            read: message.read,
                            viewed: message.viewed,
                            saved_to_inbox: message.saved_to_inbox,
                            content_type: message.content_type,
                            website_url: message.website_url,
                            deeplink_url: message.deeplink_url,
                            timestamp: message.timestamp.to_i,
                            landing_page: message.landing_page.to_json,
                            properties: message.properties.to_json
                        }
                    )
                end

                if template
                    parent_attributes.merge!(
                        message_template: {
                            id:     template.id,
                            type:   template.type,
                            title:  template.title,

                            save_to_inbox:      template.save_to_inbox,
                            notification_text:  template.notification_text,
                            date_schedule:      parse_date_schedule(template.date_schedule),
                            time_schedule:      parse_time_schedule(template.time_schedule),
                            schedule_monday:    template.schedule_monday,
                            schedule_tuesday:   template.schedule_tuesday,
                            schedule_wednesday: template.schedule_wednesday,
                            schedule_thursday:  template.schedule_thursday,
                            schedule_friday:    template.schedule_friday,
                            schedule_saturday:  template.schedule_saturday,
                            schedule_sunday:    template.schedule_sunday,

                            trigger_event_id: template.trigger_event_id,

                            filter_beacon_configuration_tags:   template.filter_beacon_configuration_tags,
                            filter_beacon_configuration_ids:    template.filter_beacon_configuration_ids,

                            filter_place_tags:  template.filter_place_tags,
                            filter_place_ids:   template.filter_place_ids,

                            content_type:   template.content_type,
                            website_url:    template.website_url,
                            deeplink_url:   template.deeplink_url,
                            experience_id:  template.experience_id,
                            properties:     template.properties,


                            scheduled_at:           template.scheduled_at ? Time.zone.parse(template.scheduled_at).iso8601 : nil,
                            scheduled_local_time:   template.scheduled_local_time,
                            scheduled_time_zone:    template.scheduled_time_zone,

                            limits: template.limits
                        }
                    )
                    
                end

                return parent_attributes
            end


        private

            def parse_date_schedule(s)
                if s == nil
                    return nil
                end

                start_date = s.first != -Float::INFINITY ? Time.zone.at(s.first).iso8601 : nil
                end_date = s.last != Float::INFINITY ? Time.zone.at(s.last).iso8601 : nil

                return {
                    start: start_date,
                    end: end_date
                }
            end

            def parse_time_schedule(t)
                if t == nil
                    return ni
                end

                start_time = t.first.to_i
                end_time = t.last.to_i

                return {
                    start: start_time,
                    end: end_time
                }
            end

            
        end
    end
end
module Events
    module NotificationEvents

        class NotificationEvent < Event

        	attr_reader :message

			def initialize(event_attributes, extra)
				super event_attributes, extra
				@message = event_attributes[:message]
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
                            timestamp: message.timestamp,
                            landing_page: message.landing_page.to_json,
                            properties: message.properties.to_json
                        }
                    )
                end

                return parent_attributes
            end
            
        end
    end
end
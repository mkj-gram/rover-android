module Events
    module MessageEvents

        class MessageEvent < Event

            attr_reader :message, :message_template, :message_template_id

            # This handles both message templates and messages
            # A ::Message is a rendered ::MessageTemplate for 1 user
            # Analytics track ::MessageTemplates
            #
            def initialize(event_attributes, extra)
                super event_attributes, extra
                if event_attributes["message_template"]
                    @message_template = event_attributes["message_template"]
                elsif event_attributes["message_id"]
                    @message = ::Message.find(event_attributes["message_id"])
                    @message_template_id = @message.message_template_id if @message
                elsif event_attributes["message"]
                    @message = event_attributes["message"]
                    @message_template_id = @message.message_template_id if @message
                end
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

                return parent_attributes
            end

        end

    end
end

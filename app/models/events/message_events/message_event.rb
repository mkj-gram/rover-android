module Events
    module MessageEvents

        class MessageEvent < Event

            attr_reader :message, :message_template, :message_template_id

            # This handles both message templates and messages
            # A ::Message is a rendered ::MessageTemplate for 1 user
            # Analytics track ::MessageTemplates
            #
            def initialize(event_attributes)
                super
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
                    template = message.message_template

                    parent_attributes.merge!(
                        {
                            message: {
                                id: message.id,
                                notification_text: message.notification_text,
                                tags: message.tags,
                                read: message.read,
                                viewed: message.viewed,
                                saved_to_inbox: message.saved_to_inbox,
                                timestamp: message.timestamp.to_i
                            }
                        },
                        {
                            message_template: {
                                id: template.id,
                                type: template.type,
                                title: template.title,
                                tags: template.tags,
                                notification_text: template.notification_text,
                                published: template.published,
                                archived: template.archived,
                                save_to_inbox: template.save_to_inbox,
                                trigger_event_id: template.trigger_event_id,
                                customer_segment_id: template.customer_segment_id,
                                content_type: template.content_type,
                                website_url: template.website_url
                            }
                        }
                    )
                end

                return parent_attributes
            end

        end

    end
end

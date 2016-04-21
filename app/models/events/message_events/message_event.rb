module Events
    module MessageEvents

        class MessageEvent < Event

            attr_reader :message

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
                end

            end


            # TODO Change this to message_template

            def attributes
                parent_attributes = super

                if message
                    parent_attributes.merge!(
                        {
                            message: {
                                id: message.id,
                                type: message.type,
                                save_to_inbox: message.save_to_inbox,
                                tags: message.tags
                            }
                        }
                    )
                end

                return parent_attributes
            end

        end

    end
end

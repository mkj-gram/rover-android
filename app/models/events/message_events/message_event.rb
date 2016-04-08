module Events
    module MessageEvents

        class MessageEvent < Event

            attr_reader :message

            def initialize(event_attributes)
                super
                if event_attributes["message"]
                    @message = event_attributes["message"]
                elsif event_attributes["message_id"]
                    @message = ::Message.find_by_id(event_attributes["message_id"])
                end

            end


            def attributes
                parent_attributes = super

                if message
                    parent_attributes.merge!(
                        {
                            message: {
                                id: message.id
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

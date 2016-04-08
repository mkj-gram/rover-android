module Events
    module MessageEvents

        class DeliveredEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_DELIVERED_EVENT_ID
            end

            Events::Pipeline.register("message", "delivered", self, { targetable: false })

        end

    end
end

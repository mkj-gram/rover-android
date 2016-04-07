module Events
    module MessageEvents

        class ViewedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_VIEWED_EVENT_ID
            end

            Events::Pipeline.register("message", "viewed", self, { targetable: false })

        end

    end
end

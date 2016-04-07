module Events
    module MessageEvents

        class SwipedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_SWIPED_EVENT_ID
            end

            Events::Pipeline.register("message", "swiped", self, { targetable: false })

        end

    end
end

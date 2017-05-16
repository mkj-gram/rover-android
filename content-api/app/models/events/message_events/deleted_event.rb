module Events
    module MessageEvents

        class DeletedEvent < MessageEvent

            def self.event_id
                Events::Constants::MESSAGE_DELETED_EVENT_ID
            end

            Events::Pipeline.register("message", "deleted", self, { targetable: false })

        end

    end
end

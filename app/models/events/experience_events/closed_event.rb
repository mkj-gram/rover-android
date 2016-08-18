module Events
    module ExperienceEvents

        class ClosedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_CLOSED_EVENT_ID
            end

            Events::Pipeline.register("experience", "closed", self, { targetable: false })
        end

    end
end

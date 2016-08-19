module Events
    module ExperienceEvents

        class ClosedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_DISMISSED_EVENT_ID
            end

            Events::Pipeline.register("experience", "dismissed", self, { targetable: false })
        end

    end
end

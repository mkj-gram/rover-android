module Events
    module ExperienceEvents

        class OpenedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_LAUNCHED_EVENT_ID
            end

            Events::Pipeline.register("experience", "opened", self, { targetable: false })
        end

    end
end

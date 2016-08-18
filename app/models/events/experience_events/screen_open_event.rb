module Events
    module ExperienceEvents

        class ScreenOpenEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_SCREEN_OPENED_EVENT_ID
            end

            Events::Pipeline.register("experience", "screen-opened", self, { targetable: false })

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @source = event_attributes["source"]
                @screen_id = event_attributes["screen_id"]
            end



            def attributes
                parent_attributes = super
                if @screen_id && parent_attributes[:experience]
                    parent_attributes[:experience].merge!({ screen_id: @screen_id })
                end
                return parent_attributes
            end

        end
    end
end

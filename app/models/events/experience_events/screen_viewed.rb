module Events
    module ExperienceEvents

        class ScreenOpenedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_SCREEN_VIEWED_EVENT_ID
            end

            Events::Pipeline.register("experience", "screen-viewed", self, { targetable: false })

            def initialize(event_attributes, extra)
                @from_screen_id = event_attributes.delete("from_screen_id")
                @from_block_id = event_attributes.delete("from_block_id")
                super event_attributes, extra
                @screen_id = event_attributes["screen_id"]
            end



            def attributes
                parent_attributes = super
                parent_attributes[:event].merge!({
                    from_screen_id: @from_screen_id,
                    from_block_id: @from_block_id
                })
                if @screen_id && parent_attributes[:experience]
                    parent_attributes[:experience].merge!({ screen_id: @screen_id })
                end
                return parent_attributes
            end

        end
    end
end

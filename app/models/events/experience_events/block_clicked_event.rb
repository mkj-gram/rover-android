module Events
    module ExperienceEvents

        class BlockClickedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_BLOCK_CLICKED_EVENT_ID
            end

            Events::Pipeline.register("experience", "block-clicked", self, { targetable: false })

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @source = event_attributes["source"]
                @screen_id = event_attributes["screen_id"]
                @block_id = event_attributes["block_id"]
            end



            def attributes
                parent_attributes = super
                if @screen_id && @block_id && parent_attributes[:experience]
                    parent_attributes[:experience].merge!({ screen_id: @screen_id, block_id: @block_id })
                end
                return parent_attributes
            end

        end
    end
end

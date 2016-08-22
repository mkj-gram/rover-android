module Events
    module ExperienceEvents

        class BlockClickedEvent < ExperienceEvent

            def self.event_id
                Events::Constants::EXPERIENCE_BLOCK_CLICKED_EVENT_ID
            end

            Events::Pipeline.register("experience", "block-clicked", self, { targetable: false })

            def initialize(event_attributes, extra)
                super event_attributes, extra
                @screen_id = event_attributes["screen_id"]
                @block_id = event_attributes["block_id"]
                @block_action = block_action_params(event_attributes["block_action"])
            end



            def attributes
                parent_attributes = super
                if @screen_id && @block_id && parent_attributes[:experience]
                    parent_attributes[:experience].merge!({ screen_id: @screen_id, block_id: @block_id, block_action: @block_action })
                end
                return parent_attributes
            end



            private

            def block_action_params(block_action)
                return nil if block_action.nil? || !block_action.is_a?(Hash)
                return block_action.slice(:type, :url, :screen_id)
            end
        end
    end
end

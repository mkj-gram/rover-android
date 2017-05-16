module LandingPageBuilder
    module Blocks
        class ImageBlock < Block
            include Virtus.model
            include LandingPageBuilder::Concerns::HasBackground
            include LandingPageBuilder::Concerns::HasBorder

            attribute :image, LandingPageBuilder::Image

            def action=(new_action)
                return if new_action.nil?
                super LandingPageBuilder::Actions::ActionBuilder.new(new_action)
            end

        end
    end
end

module LandingPageBuilder
    module Blocks
        class TextBlock < Block
            include Virtus.model
            include LandingPageBuilder::Concerns::HasText
            include LandingPageBuilder::Concerns::HasBackground
            include LandingPageBuilder::Concerns::HasBorder
            
            def ==(other)
                return false if other.nil?
                (
                    super &&
                    text_equal?(other) &&
                    background_equal?(other)
                )

            end
        end
    end
end

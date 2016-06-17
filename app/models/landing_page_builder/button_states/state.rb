module LandingPageBuilder
    module ButtonStates
        class State
            include Virtus.model
            include LandingPageBuilder::Concerns::HasBackground
            include LandingPageBuilder::Concerns::HasText
            include LandingPageBuilder::Concerns::HasBorder


            def ==(other)
                (
                    background_equal?(other) &&
                    text_equal?(other) &&
                    border_equal?(other)
                )
            end
            
        end
    end
end
